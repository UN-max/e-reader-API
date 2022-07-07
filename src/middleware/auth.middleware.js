const jwt = require('jsonwebtoken')

const errorTypes = require('../constants/error-types')
const { getUserByEmail } = require('../services/user.services')
const { checkResource } = require('../services/auth.services')
const { md5password } = require('../utils/password-handle')
const { PUBLIC_KEY } = require('../app/config')

const verifyLogin = async (ctx, next) => {
  // 1. 获取邮箱和密码
  const { email, password } = ctx.request.body

  // 2. 判断邮箱和密码是否为空
  if (!email || !password) {
    const error = new Error(errorTypes.EMAIL_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 3. 判断数据库中是否有该用户
  const result = await getUserByEmail(email)
  const user = result[0]
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 4. 判断密码是否正确
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }

  ctx.user = user
  await next()
}

const verifyAuth = async (ctx, next) => {
  console.log('登录认证的middleware');
  // 取出 headers 中的 token
  const authorization = ctx.headers.authorization
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZED)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')
  // 验证 token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZED)
    ctx.app.emit('error', error, ctx)
  }
}

const verifyPermission = async (ctx, next) => {
  console.log('权限验证的middleware');
  // 1. 获取参数 ctx.params:  { commentId: 1 }
  const [ resourceKey ] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', 's')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user

  // 查询是否具备权限
  try {
    const isPermission = await checkResource(tableName, resourceId, id)
    if (!isPermission) throw new Error()
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION)
    return ctx.app.emit('error', error, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}
