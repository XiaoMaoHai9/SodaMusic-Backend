// 导入数据库操作模块
const { db} = require('../db/index')
// 导入 bcryptjs 包 -> 用于加密密码
const bcryptjs = require('bcryptjs')
// 导入用于生成 JWT 字符串的包
const jwt = require('jsonwebtoken')
// 导入 JWT 配置
const { JWT } = require('../../config.json')

// 注册新用户的处理函数
exports.regAccount = (req, res) => {
  // 获取请求体里的数据
  const account = req.body

  // 校验该用户名是否被占用
  db.query("select * from soda_account where user_name=?", account.user_name, (err, results) => {
    // 数据库操作错误
    if(err) return res.cc(err)
    // 手机号被占用
    if(results.length > 0) return res.cc('该用户名已被占用!')

    // 校验该手机号是否被占用
    db.query("select * from soda_account where phone=?", account.phone, (err, results) => {
      // 数据库操作错误
      if(err) return res.cc(err)
      // 手机号被占用
      if(results.length > 0) return res.cc('该手机号已被注册!')

      // 对密码进行加密处理 -> hashSync(明文密码, 随机盐的长度)
      account.password = bcryptjs.hashSync(account.password, 10)

      // 13 位时间戳 -> 该账户对应的乐库号 lid
      account.lid= Date.now() 

      // 插入新账户到数据库
      db.query('insert into soda_account set?', account, (err, results) => {
        if(err) return res.cc(err)
        // 判断影响行数是否为 1
        if(results.affectedRows !== 1) return res.cc('注册失败，请稍后重试！')
        // 账户注册成功
        res.cc('恭喜~ 注册成功！', 0, 200)
      })
    })
  })
}

// 用户登录的处理函数
exports.login = (req, res) => {
  const userInfo = req.body

  db.query("select * from soda_account where phone=?", userInfo.phone, (err, results) => {
    // 数据库操作错误
    if(err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于1
    if(results.length !== 1) return res.cc('手机号未注册！')
    // 比较密码是否正确
    const compareResult = bcryptjs.compareSync(userInfo.password, results[0].password)
    if(!compareResult) return res.cc('密码错误！请重新输入！') 
    // 生成 Token 字符串
    const user = {lid: results[0].lid, phone: results[0].phone}
    const tokenStr = jwt.sign(user, JWT.SECRETKEY, { expiresIn: JWT.EXPIRESIN})
    // 登录成功
    // sign(用户的信息对象, 加密的密钥, 配置对象可配置当前有效期)
    res.send({
      err: '登录成功',
      status: 0,
      code: 200,
      // 为了方便客户端使用 token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr
    })
  })
}