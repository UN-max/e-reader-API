const Router = require('koa-router')

const { verifyAuth } = require('../middleware/auth.middleware')
const { create, get, getOne } = require('../controller/history.controller')

const historyRouter = new Router({prefix: '/history'})

// 加入阅读历史
historyRouter.post('/:bookId', verifyAuth, create)

// 获取阅读历史
historyRouter.get('/', verifyAuth, get)

// 根据id获取阅读历史
historyRouter.get('/:bookId', verifyAuth, getOne)

module.exports = historyRouter
