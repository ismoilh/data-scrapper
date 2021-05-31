const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  database: "scrapper-test",
  host: "db",
  port: "5432",
});

module.exports = pool;
