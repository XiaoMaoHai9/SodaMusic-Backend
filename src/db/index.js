const mysql = require('mysql');
const config = require('config')

// 链接数据库
const conn = mysql.createConnection({
  host: config.get('MYSQL.HOST'),
  user: config.get('MYSQL.USER'),
  password: config.get('MYSQL.PASSWORD'),
  database: config.get('MYSQL.DATABASE')
});

module.exports = conn