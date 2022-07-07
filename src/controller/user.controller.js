const { createUser, getUserByEmail, updateName, updateEmail, updatePassword, judgePassword } = require('../services/user.services')
const { checkEmail, checkPassword } = require('../utils/format-handle')
const errorTypes = require('../constants/error-types')
const { md5password } = require('../utils/password-handle')

class UserController {
  async create(ctx, next) {
    // 1. 获取用户请求传递的参数
    const user = ctx.request.body
    
    // 2. 将数据插入到数据库中
    const res = await createUser(user)

    // 3. 给用户返回数据
    ctx.body = res
  }

  async update(ctx, next) {
    const { id } = ctx.user
    const { key, value } = ctx.request.body
    if (key === 'name') {
      const res = await updateName(id, value)
      ctx.body = res
    } else if (key === 'email') {
      const result = await getUserByEmail(value)
      if (result.length) {
        const error = new Error(errorTypes.EMAIL_ALREADY_EXISTS)
        return ctx.app.emit('error', error, ctx)
      }
      if (!checkEmail(value)) {
        const error = new Error(errorTypes.EMAIL_IS_INCORRENT)
        return ctx.app.emit('error', error, ctx)
      }
      const res = await updateEmail(id, value)
      ctx.body = res
    } else if (key === 'password') {
      if (!checkPassword(value)) {
        const error = new Error(errorTypes.IMPROPER_PASSWORD)
        return ctx.app.emit('error', error, ctx)
      }
      const res = await updatePassword(id, md5password(value))
      ctx.body = res
    }
  }

  async judge(ctx, next) {
    const { id } = ctx.user
    let { psw } = ctx.params
    psw = md5password(psw)
    const res = await judgePassword(id, psw)
    ctx.body = res
  }
}

module.exports = new UserController()
