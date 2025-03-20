const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: "localhost",
  });

  const swaggerOptions = {
    info: {
      title: "Hapi js API documentation.",
      version: "1.0.0",
    },
    schemes: ['http', 'https']
  };

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
    handler: (Request, h) => {
        return "Hey there from hapi js..."
    }
  })

  await server.start();
  console.log("Server running on %s", server.info.uri);
  console.log("Swagger running on localhost:8080/documentation");

};

init();
