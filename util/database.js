const mysql = require("mysql2");
if (process.env.NODE_ENV === 'development') require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: "book-store",
  password: process.env.DB_PASS,
});

module.exports = pool.promise();
