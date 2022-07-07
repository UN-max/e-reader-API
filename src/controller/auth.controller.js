const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')

class AuthController {
  async login(ctx, next) {
    const { id, name, email } = ctx.user
    const token = jwt.sign({ id, email }, PRIVATE_KEY, {
      // 设置 token 过期时间
      expiresIn: 60 * 60 * 24 * 7,
      algorithm: 'RS256'
    })
    ctx.body = { id, name, email, token }
  }

  async success(ctx, next) {
    ctx.body = '授权成功'
  }
}

module.exports = new AuthController()
