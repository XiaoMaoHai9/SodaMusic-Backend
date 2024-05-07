const express = require('express')

const router = express.Router()

// 导入账户路由处理函数的对应模块
const song_handler = require('../router_handler/song')

// 导入验证表单数据的中间件
// const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
// const {reg_login_schema} = require('../schema/account')

// 上传音频详情
router.post('/set', song_handler.setSongDetail)
// 获取乐库
router.get('/songlib', song_handler.getSongLib)
// 获取音频详情
router.get('/info', song_handler.getSongDetail)
// 音频详情修改
router.post('/modify', song_handler.modifySongDetail)
// 音频删除
router.delete('/delete', song_handler.deleteSong)

module.exports = router