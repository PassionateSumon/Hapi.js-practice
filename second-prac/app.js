"use scrict";
require("dotenv").config();
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const server = require("./config/server");
const baseRouter = require("./routes");
const Pack = require("./package");

const init = async () => {
  const swaggerOptions = {
    info: {
      title: "Hapi js API documentation.",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
  };

  // await server.register([
  //   Inert,
  //   Vision,
  //   {
  //     plugin: HapiSwagger,
  //     options: swaggerOptions,
  //   },
  // ]);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hey from Hapi js server!!";
    },
  });

  await server.register(baseRouter, {
    routes: {
      prefix: "/api",
    },
  });

  server.events.on("response", function (req) {
    console.log(
      req.info.remoteAddress +
        ": " +
        req.method.toUpperCase() +
        " " +
        req.path +
        "-->" +
        req.response.statusCode
    );
  });

  await server.start();
  console.log("Server running at %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
