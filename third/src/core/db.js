const db = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: "9000",
    database: "third-hapijs-be",
    user: "postgres",
    password: "SonuBE@2122",
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "../../src/core/migrations",
  },
  seeds: {
    directory: "../../src/core/seeds",
  },
});

module.exports = db;
