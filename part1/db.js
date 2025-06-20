const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "",
  password: "",
  database: "",
});

module.exports = pool;
