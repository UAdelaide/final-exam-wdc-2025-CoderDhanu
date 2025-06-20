const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "doguser",
  password: "dogpass",
  database: "DogWalkService",
});

module.exports = pool;
