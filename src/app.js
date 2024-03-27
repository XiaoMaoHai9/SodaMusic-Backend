const { SERVER, JWT } = require('./config/default.json');
const joi = require('joi')
const express = require('express');
// 创建应用对象
const app = express();
// 配置解析 application/x-www-form-urlencoded 格式的表单数据中间件
app.use(express.urlencoded({ extended: false}))
// 路由之前 -> 封装 res.cc 函数 -> 用于统一处理 数据库错误
app.use((req, res, next) => {
	res.cc = function (err, status = 1, code = 400){
		res.send({
			status,
			msg: err instanceof Error ? err.message : err,
			code: err.code ? err.status : code
		})
	}
	next()
})

const cors = require('cors')
// 要在路由之前配置 cors中间件，从而解决接口跨域的问题
app.use(cors())

const bodyParser = require('body-parser');
// 使用 bodyParser 中间件解析请求体为 JSON 格式
app.use(bodyParser.json());

// 导入用于将客户端发来的 JWT 字符串，解析成 JSON 对象的包
const {expressjwt} = require('express-jwt')
// unless() 用来排除哪些接口不需要 Token 验证
app.use(expressjwt({secret: JWT.SECRETKEY, algorithms: ['HS256']}).unless({path: [/^\/api\//]}))

// 导入 account 接口路由文件
const accountRouter = require('./routes/account');
const userInfoRouter = require('./routes/userInfo');

// 设置与使用路由中间件
app.use('/api', accountRouter);
app.use('/my', userInfoRouter);

// 全局错误捕获 -> 定义错误级别的中间件
app.use((err, req, res, next) => {
	// 数据验证失败
	if(err instanceof joi.ValidationError) return res.cc(err)
	// 身份认证失败
	if(err.name === 'UnauthorizedError') return res.cc(err)
	// 未知错误
	res.cc(err)
})

// 3、 监听端口 启动服务
app.listen(SERVER.PORT, (err) =>{
	if(err){
		console.log('服务启动失败...');
	}
	console.log(`服务已经启动, 监听端口为 ${SERVER.PORT}...`);
});