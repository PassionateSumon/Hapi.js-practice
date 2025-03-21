import { Request, ResponseToolkit } from "@hapi/hapi";
import { ApiResponse } from "../interfaces/ApiResponse.interface";
import { login, signup } from "../services/auth.service";

export const signupController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req?.payload;
    // console.log("8 -- contr ",payload)
    const res = await signup(payload);
    // console.log(res);

    const response: ApiResponse<typeof res> = {
      status: "success",
      data: res,
      message: "User created successfully.",
    };

    return h.response(response).code(200);
  } catch (error: any) {
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
    const payload = req?.payload;
    const res = await login(payload);
    // console.log(res)

    const response: ApiResponse<typeof res> = {
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
