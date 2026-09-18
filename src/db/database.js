const mysql = require("mysql2/promise");
// mysql이라는 변수를 통해 MySQL 드라이버의 기능을 사용
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;
