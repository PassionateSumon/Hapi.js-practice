const Users = require("../seeddata/Users");

exports.seed = function (knex) {
  return Promise.all([knex("Users").insert(Users)]);
};
