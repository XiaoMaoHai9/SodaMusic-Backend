const express = require('express')

const router = express.Router()

// 导入账户路由处理函数的对应模块
const search_handler = require('../router_handler/search')

// 导入验证表单数据的中间件
// const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
// const {reg_login_schema} = require('../schema/account')

// 歌曲搜索
router.get('/', search_handler.searchMicLib)

module.exports = router