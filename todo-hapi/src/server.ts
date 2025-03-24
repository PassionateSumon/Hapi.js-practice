import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import Jwt from "@hapi/jwt";
import { registerSwagger } from "./plugins/swagger.plugin";
import authRoutes from "./routes/auth.route";
import { prisma } from "./config/db";
import { ApiError } from "./utils/ApiError.util";
import todoRoutes from "./routes/todo.route";

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Jwt);
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    validate: async (decoded: any) => {
      // console.log("27 -- ", decoded);
      // console.log("27 -- ", decoded.decoded.payload.userId);
      const user = await prisma.user.findUnique({
        where: { id: decoded.decoded.payload.userId },
      });
      if (!user) {
        throw new ApiError("Unauthorized!", 401);
      }
      return { isValid: true, credentials: decoded.decoded.payload };
    },
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400,
      timeSkewSec: 15,
    },
  });

  await registerSwagger(server);

  server.route(authRoutes);
  server.route(todoRoutes);

  await server.start();
  console.log(`Server is running on %s `, server.info.uri);
  console.log(
    `Swagger is running on http://localhost:${process.env.PORT}/documentation`
  );
};

init();
