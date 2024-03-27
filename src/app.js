const express = require('express');
const config = require('config');
const cors = require('cors')
const bodyParser = require('body-parser');
const joi = require('joi')

// 导入用于生成 JWT 字符串的包
const jwt = require('jsonwebtoken')
// 导入用于将客户端发来的 JWT 字符串，解析成 JSON 对象的包
const expressJWT = require('express-jwt')

// 2、 创建应用对象
const app = express();

// 要在路由之前配置 cors中间件，从而解决接口跨域的问题
app.use(cors())

// 使用 bodyParser 中间件解析请求体为 JSON 格式
app.use(bodyParser.json());

// 路由之前 -> 封装 res.cc 函数 -> 用于统一处理 数据库错误
app.use((req, res, next) => {
	res.cc = function (err, status = 1, code = 400){
		res.send({
			status,
			msg: err instanceof Error ? err.message : err,
			code
		})
	}
	next()
})

const port = config.get('SERVER.PORT');

// 导入 account 接口路由文件
const accountRouter = require('./routes/account');
const { ValidationError } = require('@hapi/joi/lib/errors');

// 配置解析 application/x-www-form-urlencoded 格式的表单数据中间件
app.use(express.urlencoded({ extended: false}))

// 设置与使用路由中间件
app.use('/api', accountRouter);

// 全局错误捕获 -> 定义错误级别的中间件
app.use(function(err, req, res, next) {
	// 数据验证失败
	if(err instanceof joi.ValidationError) return res.cc(err)
	// 未知错误
	res.cc(err)
})

// 3、 监听端口 启动服务
app.listen(port, (err) =>{
	if(err){
		console.log('服务启动失败...');
	}
	console.log(`服务已经启动, 监听端口为 ${port}...`);
});