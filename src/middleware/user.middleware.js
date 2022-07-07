const errorTypes = require('../constants/error-types')
const { getUserByEmail } = require('../services/user.services')
const { md5password } = require('../utils/password-handle')
const { checkEmail, checkPassword } = require('../utils/format-handle')

const verifyUser = async (ctx, next) => {
  // 1. 获取用户名、邮箱和密码
  const { name, email, password, surePassword } = ctx.request.body
  
  // 2. 判断用户名、邮箱或者密码不能为空
  if (!name || !email || !password || !surePassword) {
    const error = new Error(errorTypes.NAME_OR_EMAIL_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 2.1 判断密码一致性
  if (password !== surePassword) {
    const error = new Error(errorTypes.INCONSISTENT_PASSWORDS)
    return ctx.app.emit('error', error, ctx)
  }

  // 3. 判断邮箱和密码的合法性
  if (!checkEmail(email)) {
    const error = new Error(errorTypes.EMAIL_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }
  if (!checkPassword(password)) {
    const error = new Error(errorTypes.IMPROPER_PASSWORD)
    return ctx.app.emit('error', error, ctx)
  }

  // 4. 判断这次注册的邮箱是没有被注册过的
  const result = await getUserByEmail(email)
  // console.log(result);
  if (result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }
  await next()
}

// 对密码进行 md5 加密
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5password(password)
  await next()
}

module.exports = {
  verifyUser,
  handlePassword
}
