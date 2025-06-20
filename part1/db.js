const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "alice123",
  password: "dogpass",
  database: "DogWalkService",
});

module.exports = pool;
