const Router = require('koa-router')

const { create, update, judge } = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { verifyAuth } = require('../middleware/auth.middleware')

const userRouter = new Router({prefix: '/user'})

// 用户注册接口
userRouter.post('/', verifyUser, handlePassword, create)

// 修改密码前得先输入密码，判断密码是否正确，返回一个Boolean
userRouter.get('/:psw', verifyAuth, judge)

// 修改用户信息接口(小程序不支持PATCH)
userRouter.post('/update', verifyAuth, update)

module.exports = userRouter
