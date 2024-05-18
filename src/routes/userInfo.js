const express = require('express')

const router = express.Router()

// 导入账户路由处理函数的对应模块
const userInfo_handler = require('../router_handler/userInfo')

// 导入验证表单数据的中间件
// const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
// const {reg_login_schema} = require('../schema/account')

// 获取用户基本信息接口
router.get('/userinfo', userInfo_handler.getUserInfo)
// 更新用户信息接口
router.post('/update', userInfo_handler.updateUserInfo)

module.exports = router