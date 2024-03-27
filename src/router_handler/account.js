// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 包 -> 用于加密密码
const bcryptjs = require('bcryptjs')

// 注册新用户的处理函数
exports.regAccount = (req, res) => {
  // 获取请求体里的数据
  const account = req.body

  // 校验该手机号是否被占用
  db.query("select * from soda_account where phone=?", account.phone, (err, result) => {
    // 数据库操作错误
    if(err) return res.cc(err)
    // 手机号被占用
    if(result.length > 0) return res.cc('该手机号已被注册')

    // 对密码进行加密处理 -> hashSync(明文密码, 随机盐的长度)
    account.password = bcryptjs.hashSync(account.password, 10)
    // 插入新账户到数据库
    db.query('insert into soda_account set?', account, (err, result) => {
      if(err) return res.cc(err)
      // 判断影响行数是否为 1
      if(result.affectedRows !== 1) return res.cc('注册失败，请稍后重试！')
      // 账户注册成功
      res.cc('恭喜~ 注册成功！', 0, 200)
    })
  })
}

// 用户登录的处理函数
exports.login = (res, req) => {
  const userInfo = req.body
  // 登录失败
  if(userInfo.phone !== '15375692553' || userInfo.password !== '20010919'){
    res.send({
      status: 400,
      msg: '登录失败', // 状态描述
    })
    return
  }

  // 登录成功
  // sign(用户的信息对象, 加密的密钥, 配置对象可配置当前有效期)
  res,send({
    status: 200,
    msg: '登录成功',
    token: jwt.sign({phone: userInfo.phone}, secretKey, { expiresIn: '30s'})
  })
}