import { Request, ResponseToolkit } from "@hapi/hapi";
import { ApiResponse } from "../interfaces/ApiResponse.interface";
import { ApiError } from "../utils/ApiError.util";
import { prisma } from "../config/db";

const checkCreds = (credentials: any) => {
  const userId = credentials?.userId;
  if (!credentials || !userId) {
    const apiError = new ApiError("Unauthorized to add todo!", 401);
    return apiError;
  }
  return userId;
};

export const addTodo = async (req: Request, h: ResponseToolkit) => {
  try {
    const checkAuth = checkCreds(req.auth.credentials);
    if (checkAuth instanceof ApiError) {
      return h.response(checkAuth.toJSON()).code(401);
    }

    const payload: any = req?.payload;
    if (!payload || !payload.todo) {
      const apiError = new ApiError("Must have a todo", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const todo = await prisma.todo.create({
      data: {
        userId: checkAuth,
        title: payload.todo,
        done: false,
      },
    });

    const response: ApiResponse<typeof todo> = {
      status: "success",
      data: todo,
      message: "Todo created successfully.",
    };
    return h.response(response).code(200);
  } catch (error: any) {
    const statusCode = error?.code || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: error?.message || "Internal server error at addTodo controller",
    };
    return h.response(response).code(statusCode);
  }
};

export const getTodos = async (req: Request, h: ResponseToolkit) => {
  try {
    const checkAuth = checkCreds(req.auth.credentials);
    if (checkAuth instanceof ApiError) {
      return h.response(checkAuth.toJSON()).code(401);
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: checkAuth,
      },
    });
    if (!todos) {
      const apiError = new ApiError("No todos found", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const response: ApiResponse<typeof todos> = {
      status: "success",
      data: todos,
      message: "Todos fetched successfully.",
    };
    return h.response(response).code(200);
  } catch (error: any) {
    const statusCode = error?.code || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: error?.message || "Internal server error at getTodos controller",
    };
    return h.response(response).code(statusCode);
  }
};

export const updateTodo = async (req: Request, h: ResponseToolkit) => {
  try {
    const checkAuth = checkCreds(req.auth.credentials);
    if (checkAuth instanceof ApiError) {
      return h.response(checkAuth.toJSON()).code(401);
    }

    const id = req?.params?.id;
    if (!id) {
      const apiError = new ApiError("Todo id is required", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const payload: any = req?.payload;
    if (!payload || !(payload?.todo || payload?.done)) {
      const apiError = new ApiError("At least one update is required!", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    if (!todo) {
      const apiError = new ApiError("Todo is not found", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: payload.todo ? payload.todo : todo.title,
        done: payload.done ? payload.done : todo.done,
      },
    });
    const response: ApiResponse<typeof todo> = {
      status: "success",
      data: updatedTodo,
      message: "Todo updated successfully.",
    };
    return h.response(response).code(200);
  } catch (error: any) {
    const statusCode = error?.code || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: error?.message || "Internal server error at updateTodo controller",
    };
    return h.response(response).code(statusCode);
  }
};

export const deleteTodo = async (req: Request, h: ResponseToolkit) => {
  try {
    const checkAuth = checkCreds(req.auth.credentials);
    if (checkAuth instanceof ApiError) {
      return h.response(checkAuth.toJSON()).code(401);
    }

    const id = req?.params?.id;
    if (!id) {
      const apiError = new ApiError("Todo id is required", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    if (!todo) {
      const apiError = new ApiError("Todo is not found", 400);
      return h.response(apiError.toJSON()).code(400);
    }

    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });
    const response: ApiResponse<typeof todo> = {
      status: "success",
      data: deletedTodo,
      message: "Todo deleted successfully.",
    };
    return h.response(response).code(200);
  } catch (error: any) {
    const statusCode = error?.code || 500;
    const response: ApiResponse<null> = {
      status: "Failed",
      error: error?.message || "Internal server error at deleteTodo controller",
    };
    return h.response(response).code(statusCode);
  }
};
