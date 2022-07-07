const Router = require('koa-router')

const { verifyAuth } = require('../middleware/auth.middleware')
const { rate, create, calc } = require('../controller/rate.controller')
const rateRouter = new Router({prefix: '/rate'})

// 获取某个用户对某本书的评分
rateRouter.get('/:bookId', verifyAuth, rate)

// 对书进行评分
rateRouter.post('/:bookId', verifyAuth, create)

// 书评统计（好看，一般，不好看）
rateRouter.get('/calc/:bookId', calc)

module.exports = rateRouter
