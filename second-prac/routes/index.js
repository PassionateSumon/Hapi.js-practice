const test = require("./Test");

module.exports = {
  name: "base-route",
  version: "1.0.0",
  register: (server, options) => {
    server.route(test);
  },
};
