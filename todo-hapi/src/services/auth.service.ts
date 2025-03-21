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
    const salt = CryptoUtil.generateSalt();
    const hashedPassword = CryptoUtil.hashPassword(payload.password, salt);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: `${hashedPassword}:${salt}`,
      },
    });

    return {
      user: { id: user.id, email: user.email },
    };
  } catch (error) {
    throw new ApiError("Internal server error at signup service", 500);
  }
};

export const login = async (payload: any) => {
  try {
    const { email, password } = payload;
    if (!email || !password) {
      throw new ApiError("Credentials must be needed!", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new ApiError("User not found!", 400);
    }
    const [hash, salt] = user.password.split(":");
    const isMatchedPassword = CryptoUtil.verifyPassword(password, salt, hash);
    if (!isMatchedPassword) {
      throw new ApiError("Unauthorized!", 401);
    }
    const validUser = await prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });

    const token = JWTUtil.generateToken(user.id);
    return {
      user: validUser,
      token,
    };
  } catch (error) {
    throw new ApiError("Internal server error at login service", 500);
  }
};
