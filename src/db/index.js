const mysql = require('mysql');
const {MYSQL} = require('../config/default.json')

// 链接数据库
const conn = mysql.createConnection({
  host: MYSQL.HOST,
  user: MYSQL.USER,
  password: MYSQL.PASSWORD,
  database: MYSQL.DATABASE
});

module.exports = conn