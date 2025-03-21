import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError.util";
import { CryptoUtil } from "../utils/crypto.util";
import { JWTUtil } from "../utils/jwt.util";

export const signup = async (payload: any) => {
  try {
    const existedUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existedUser) {
      throw new ApiError("User already exists!", 409);
    }
    // console.log(payload)
    const salt = CryptoUtil.generateSalt();
    const hashedPassword = CryptoUtil.hashPassword(payload.password, salt);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: `${hashedPassword}:${salt}`,
      },
    });
    // console.log("25---")

    return {
      user: { id: user.id, email: user.email },
    };
  } catch (error: any) {
    if (error.code === 409) {
      throw new ApiError("User already exists!", 409);
    }
    throw new ApiError("Internal server error at signup service", 500);
  }
};

export const login = async (payload: any) => {
  try {
    const { email, password } = payload;
    // console.log("1")

    const user = await prisma.user.findUnique({
      where: { email },
    });
    // console.log("2")
    if (!user) {
      throw new ApiError("User not found!", 400);
    }
    // console.log("3")
    const [hash, salt] = user.password.split(":");
    // console.log("3")
    const isMatchedPassword = CryptoUtil.verifyPassword(password, salt, hash);
    // console.log("4")
    if (!isMatchedPassword) {
      throw new ApiError("Unauthorized!", 401);
    }
    // console.log("5")
    const validUser = await prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });
    // console.log("6")

    const token = JWTUtil.generateToken(user.id);
    // console.log("7")
    return {
      user: validUser,
      token,
    };
  } catch (error: any) {
    if (error.code === 400) {
      // console.log("here 76", error?.message)
      throw new ApiError("User not found!!", 400);
    }
    if (error.code === 401) {
      // console.log("here 76", error?.message)
      throw new ApiError("Unauthorized!!", 401);
    }
    // console.log("here 79")
    throw new ApiError("Internal server error at login service", 500);
  }
};
