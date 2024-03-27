const express = require('express')
// 导入用于生成 JWT 字符串的包
const jwt = require('jsonwebtoken')
// 导入用于将客户端发来的 JWT 字符串，解析成 JSON 对象的包
const expressJWT = require('express-jwt')

// 定义 secret 密钥
const secretKey = 'This is a secreKey for encryption'

const router = express.Router()

// 导入账户路由处理函数的对应模块
const user_handler = require('../router_handler/account')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {reg_login_schema} = require('../schema/account')

// 注册接口
// router.post('/register', expressJoi(reg_login_schema), user_handler.regAccount)
router.post('/register', user_handler.regAccount)

// 登录接口
router.post('/login', user_handler.login)

module.exports = router