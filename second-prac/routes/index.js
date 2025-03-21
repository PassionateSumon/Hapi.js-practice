const test = require("./Test");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "base-route",
  version: "1.0.0",
  register: (server, options) => {
    server.route(test);
  },
  // register: (server, options) => {
  //   const rfs = fs.readFileSync(
  //     path.join(__dirname, "./Test/index.js")
  //   );
  //   for (let file of rfs) {
  //     const rf = require(`./Test/index/${file}`);
  //     for (let route of rf) {
  //       server.route(route);
  //     }
  //   }
  // },
};
