const express = require('express')

const router = express.Router()

// 导入账户路由处理函数的对应模块
const user_handler = require('../router_handler/account')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {reg_login_schema} = require('../validate/account')
const {reg_register_schema} = require('../validate/account')

// 注册接口
router.post('/register', expressJoi(reg_register_schema), user_handler.regAccount)

// 登录接口
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

module.exports = router