const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "doguser",
  user: "root",
  password: "",
  database: "DogWalkService",
});

module.exports = pool;
