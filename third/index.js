const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const path = require("path");
const fs = require("fs");
const pack = require("./package");
const Jwt = require("hapi-auth-jwt2");
const db = require("./src/core/db");

const validate = async function (decoded, request) {
  const creds = decoded || {};
  if (!creds) {
    return { isValid: false };
  } else {
    if (Math.floor(new Date().getTime / 1000 < creds.exp)) {
      return { isValid: true };
    }
    return { isValid: false };
  }
};

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
      },
    },
  });

  const swaggerOptions = {
    info: {
      title: "Hapi js API documentation.",
      version: pack.version,
    },
    schemes: ["http", "https"],
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ jwt: [] }],
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  await server.register(Jwt);

  server.auth.strategy("jwt", "jwt", {
    key: "a1b1b2b3b4b5b6",
    verifyOptions: {
      algorithm: ["HS256"],
    },
    validate: validate,
  });

  server.auth.default("jwt");

  const registerdRoutes = async () => {
    const routeFiles = fs.readdirSync(path.join(__dirname, "./src/api/routes"));
    for (let file of routeFiles) {
      const rf = require(`./src/api/routes/${file}`);
      for (let route of rf) {
        server.route(route);
      }
    }
  };

  await registerdRoutes();
  await server.start();
  console.log("Server running on %s", server.info.uri);
  console.log("Swagger running on http://localhost:9000/documentation");
};

init();
