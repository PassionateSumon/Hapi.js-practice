import { ServerRoute } from "@hapi/hapi";
import {
  loginController,
  signupController,
} from "../controllers/auth.controller";
import Joi from "joi";

const authRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/signup",
    handler: signupController,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().messages({
            "any.required": "email is required!",
          }),
          password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 chars",
            "any.required": "password is required!",
          }),
        }),
        failAction: (request, h, err: any) => {
          // console.log(err);
          const errorMessage =
            err?.details?.[0]?.message || "Invalid request payload.";
          return h
            .response({ status: "Failed", error: errorMessage })
            .code(400)
            .takeover();
        },
      },
      tags: ["api", "auth"],
      description: "Signup a new user.",
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: loginController,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().messages({
            "any.required": "email is required!",
          }),
          password: Joi.string().required().messages({
            "any.required": "password is required!",
          }),
        }),
        failAction: (request, h, err: any) => {
          // console.log(err);
          const errorMessage =
            err?.details?.[0]?.message || "Invalid request payload.";
          return h
            .response({ status: "Failed", error: errorMessage })
            .code(400)
            .takeover();
        },
      },
      tags: ["api", "auth"],
      description: "Login a user.",
      auth: false,
    },
  },
];

export default authRoutes;
