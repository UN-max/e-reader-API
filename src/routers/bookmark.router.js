const Router = require('koa-router')

const { verifyAuth } = require('../middleware/auth.middleware')
const { create, getAll, getOne } = require('../controller/bookmark.controller')

const bookmarkRouter = new Router({ prefix: '/bookmark' })

// 添加或删除书签
bookmarkRouter.post('/:bookId', verifyAuth, create)

// 获取书签
bookmarkRouter.get('/:bookId', verifyAuth, getAll)

module.exports = bookmarkRouter
