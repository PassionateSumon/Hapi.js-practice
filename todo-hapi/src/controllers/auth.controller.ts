import { Request, ResponseToolkit } from "@hapi/hapi";
import { ApiResponse } from "../interfaces/ApiResponse.interface";
import { login, signup } from "../services/auth.service";

export const signupController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req?.payload;
    const res = signup(payload);

    const response: ApiResponse<typeof res> = {
      status: "success",
      data: res,
      message: "User created successfully.",
    };

    return h.response(response).code(200);
  } catch (error: any) {
    const statusCode = error?.statusCode || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: "Internal server error at signup controller",
    };
    return h.response(response).code(statusCode);
  }
};

export const loginController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req?.payload;
    const res = login(payload);

    const response: ApiResponse<typeof res> = {
      status: "success",
      data: res,
      message: "User login successfully.",
    };

    return h.response(response).code(200);
  } catch (error: any) {
    const statusCode = error?.statusCode || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: "Internal server error at login controller",
    };
    return h.response(response).code(statusCode);
  }
};
