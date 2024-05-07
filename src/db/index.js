const mysql = require('mysql');
const { MYSQL } = require('../../config.json')

// 连接数据库
exports.db = mysql.createConnection({
  host: MYSQL.HOST,
  user: MYSQL.USER,
  password: MYSQL.PASSWORD,
  database: MYSQL.DATABASE
});