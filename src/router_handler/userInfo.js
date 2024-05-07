// 导入数据库操作模块
const {db} = require('../db/index')
const path = require('path')

exports.getUserInfo = (req, res) => {
  db.query('select id, user_name, phone, avatar_url, lid from soda_account where id=?', req.auth.id, (err, results) => {
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