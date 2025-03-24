import { Request, ResponseToolkit } from "@hapi/hapi";
import { ApiResponse } from "../interfaces/ApiResponse.interface";
import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError.util";
import { CryptoUtil } from "../utils/crypto.util";
import { JWTUtil } from "../utils/jwt.util";

export const signupController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req?.payload;

    const existedUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existedUser) {
      const apiError = new ApiError("User already exists!", 409);
      return h.response(apiError.toJSON()).code(409);
    }

    const salt = CryptoUtil.generateSalt();
    const hashedPassword = CryptoUtil.hashPassword(payload.password, salt);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: `${hashedPassword}:${salt}`,
      },
    });

    const response: ApiResponse<any> = {
      status: "success",
      data: { user: { id: user.id, email: user.email } },
      message: "User created successfully.",
    };

    return h.response(response).code(200);
  } catch (error: any) {
    // console.log(error)
    const statusCode = error?.code || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: error?.message || "Internal server error at signup controller",
    };
    return h.response(response).code(statusCode);
  }
};

export const loginController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req?.payload;

    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const apiError = new ApiError("User not found!", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const [hash, salt] = user.password.split(":");
    const isMatchedPassword = CryptoUtil.verifyPassword(password, salt, hash);
    if (!isMatchedPassword) {
      const apiError = new ApiError("Unauthorized!", 401);
      return h.response(apiError.toJSON()).code(401);
    }

    const validUser = await prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });

    const token = JWTUtil.generateToken(user.id);

    const res = {
      user: validUser,
      token,
    };

    const response: ApiResponse<any> = {
      status: "success",
      data: res,
      message: "User login successfully.",
    };

    return h.response(response).code(200);
  } catch (error: any) {
    // console.log(error?.message);
    const statusCode = error?.code || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: error?.message || "Internal server error at login controller",
    };
    return h.response(response).code(statusCode);
  }
};
