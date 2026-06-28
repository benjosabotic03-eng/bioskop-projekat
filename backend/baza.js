const { Pool } = require("pg");
const konfig = require("./konfiguracija");

const connectionPool = new Pool({
  host: konfig.baza.host,
  port: konfig.baza.port,
  user: konfig.baza.user,
  password: konfig.baza.password,
  database: konfig.baza.database,
  max: 10
});

module.exports = connectionPool;
