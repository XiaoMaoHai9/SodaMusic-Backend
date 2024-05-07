// 导入验证规则的包
const joi = require('joi')

/** 
 * string()  值必须是字符串
 * alphanum()  值只能是包含 a-zA-Z0-9
 * min(length)  最小长度
 * max(length)  最大长度
 * required()  值为必填项，不能为 undefined
 * pattern(正则表达式)  值必须符合正则表达式的规则
 */
 
// 用户名的验证规则 -> 中英文与字符-_ -> 长度不能超过15个汉字或30个数字英文字符
const user_name = joi.string().min(1).max(30).pattern(/^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/)

// 手机号的验证规则 -> 11位手机号
const phone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/).required()

// 密码的验证规则 -> 至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符
const password = joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/).required()

const avatar_url = joi.string().required()

// 暴露 注册表单的验证规则对象
exports.reg_register_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    user_name,
    phone,
    password,
    avatar_url
    // 添加未知字段验证，以允许未知字段但不验证图片地址字段
    // ...joi.object().unknown(true),
  }
}

// 暴露 登录表单的验证规则对象
exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    phone,
    password
  }
}