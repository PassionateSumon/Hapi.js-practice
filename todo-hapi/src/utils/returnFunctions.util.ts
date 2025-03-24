import { ResponseToolkit } from "@hapi/hapi";
import { statusCodes } from "../config/constants";

function success(
  data: any,
  message = "Success",
  statusCode: any = statusCodes.SUCCESS
) {
  return (res: ResponseToolkit) =>
    res
      .response({
        statusCode,
        message,
        data,
      })
      .code(statusCode);
}

function error(
  data: any,
  message = "Error",
  statusCode: any = statusCodes.SERVER_ISSUE
) {
  return (res: ResponseToolkit) =>
    res
      .response({
        statusCode,
        message,
        data,
      })
      .code(statusCode);
}

function redirect(url: string) {
  return (res: ResponseToolkit) => res.redirect(url);
}

export default {
  success,
  error,
  redirect,
};
