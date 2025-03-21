import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import Jwt from "@hapi/jwt";
import { registerSwagger } from "./plugins/swagger.plugin";
import authRoutes from "./routes/auth.route";

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: "localhost",
  });

  await server.register(Jwt);
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    validate: async (decoded: any) => {
      return { isValid: true, credentials: decoded };
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

  await server.start();
  console.log(`Server is running on %s `, server.info.uri);
  console.log(
    `Swagger is running on http://localhost${process.env.PORT}/documentation`
  );
};

init();
