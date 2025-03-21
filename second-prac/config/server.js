const Hapi = require("@hapi/hapi");
const server = Hapi.server({
  port: 3005,
  host: "localhost",
  routes: {
    cors: {
      origin: ["*"],
      headers: ["Accept", "Authorization", "Content-type", "If-None-Match"],
      exposedHeaders: ["WWW-Authenticate", "Server-Authorization"],
      additionalExposedHeaders: ["Accept"],
      maxAge: 60,
      credentials: true,
    },
  },
});

module.exports = server;
