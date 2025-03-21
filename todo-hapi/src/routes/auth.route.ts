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
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        }),
      },
      tags: ["api", "auth"],
      description: "Signup a new user.",
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: loginController,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        }),
      },
      tags: ["api", "auth"],
      description: "Login a user.",
    },
  },
];

export default authRoutes;
