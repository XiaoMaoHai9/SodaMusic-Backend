// 导入数据库操作模块
const {db} = require('../db/index')
const path = require('path')
// 导入 bcryptjs 包 -> 用于加密密码
const bcryptjs = require('bcryptjs')
// 导入用于生成 JWT 字符串的包
const jwt = require('jsonwebtoken')
// 导入 JWT 配置
const { JWT } = require('../../config.json')

exports.getUserInfo = (req, res) => {
  db.query('select id, user_name, phone, avatar_url, lid from soda_account where lid=?', req.auth.lid, (err, results) => {
    // 执行 SQL 语句失败
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('获取用户信息失败')

    // const currentDirectory = __dirname
    results[0].avatar_url = 'http://' + path.join(req.headers.host, '/static',results[0].avatar_url.substring(6)).replace(/\\/g, '/')
    // 将用户信息响应给客户端
    res.send({
      status: 0,
      msg: '获取用户信息成功',
      code: 200,
      data: results[0]
    })
  })
}

// 修改用户信息
exports.updateUserInfo = async (req, res) => {
  const { lid, user_name, phone, password } = req.body;

  // 构建查询条件
  let query = `update soda_account set `;
  const queryParams = [];

  try {
    if (user_name) {
      // 校验该用户名是否被占用
      const userNameResults = await new Promise((resolve, reject) => {
        db.query("select * from soda_account where user_name=?", user_name, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      // 用户名被占用
      if (userNameResults.length > 0) {
        return res.cc('该用户名已被占用!');
      }

      query += 'user_name = ?, ';
      queryParams.push(user_name);
    }

    if (phone) {
      // 校验该手机号是否被占用
      const phoneResults = await new Promise((resolve, reject) => {
        db.query("select * from soda_account where phone=?", phone, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      // 手机号被占用
      if (phoneResults.length > 0) {
        return res.cc('该手机号已被注册!');
      }

      query += 'phone = ?, ';
      queryParams.push(phone);
    }

    if (password) {
      // 对密码进行加密处理
      const hashedPassword = bcryptjs.hashSync(password, 10);

      query += 'password = ?, ';
      queryParams.push(hashedPassword);
    }

    // 去掉最后一个多余的逗号和空格
    query = query.slice(0, -2);

    query += ` where lid = ?`;
    queryParams.push(lid);

    const updateResults = await new Promise((resolve, reject) => {
      db.query(query, queryParams, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // 生成 Token 字符串
    const user = {lid, phone}
    const tokenStr = jwt.sign(user, JWT.SECRETKEY, { expiresIn: JWT.EXPIRESIN})

    res.send({
      status: 0,
      msg: '用户信息修改成功 ！',
      code: 200,
      token: 'Bearer ' + tokenStr
    });

  } catch (err) {
    // 数据库操作错误
    return res.cc(err);
  }
};