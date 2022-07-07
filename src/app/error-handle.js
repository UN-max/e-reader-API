const errorTypes = require('../constants/error-types')

const errorHandler = (error, ctx) => {
  let status, message
  switch (error.message) {
    case errorTypes.NAME_OR_EMAIL_OR_PASSWORD_IS_REQUIRED:
      status = 400; // bad request
      message = '信息不能为空'
      break;
    case errorTypes.EMAIL_OR_PASSWORD_IS_REQUIRED:
      status = 400; // bad request
      message = '信息不能为空'
      break;
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409; // conflict 发生冲突
      message = '用户已存在'
      break;
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400; // 参数错误
      message = '用户不存在'
      break;
    case errorTypes.INCONSISTENT_PASSWORDS:
      status = 400;
      message = '密码不一致'
      break;
    case errorTypes.EMAIL_IS_INCORRENT:
      status = 400; // 参数错误
      message = '邮箱不合法'
      break;
    case errorTypes.EMAIL_ALREADY_EXISTS:
      status = 400
      message = '该邮箱已被注册'
      break;
    case errorTypes.IMPROPER_PASSWORD:
      status = 400
      message = '密码不合规范'
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400; // 参数错误
      message = '密码错误'
      break;
    case errorTypes.UNAUTHORIZED:
      status = 401; // 未授权
      message = '无效token'
      break;
    case errorTypes.UNPERMISSION:
      status = 401; // 未授权
      message = '无权限'
      break;
    default:
      status = 404; // bad request
      message = 'NOT FOUND'
      break;
  }
  ctx.status = status
  ctx.body = message
}

module.exports = errorHandler
