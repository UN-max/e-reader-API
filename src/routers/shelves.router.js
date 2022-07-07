const Router = require('koa-router')

const { verifyAuth } = require('../middleware/auth.middleware')
const { verifyShelves } = require('../middleware/shelves.middleware')
const { getAll, shelves, add, del } = require('../controller/shelves.controller')

const shelvesRouter = new Router({prefix: '/shelves'})

// 获取书架信息
shelvesRouter.get('/', verifyAuth, getAll)

// 加入书架
shelvesRouter.post('/:bookId', verifyAuth, verifyShelves, add)

// 查看此书是否在书架中
shelvesRouter.get('/:bookId', verifyAuth, shelves)

// 删除书架的书籍
shelvesRouter.delete('/:bookId', verifyAuth, del)

module.exports = shelvesRouter
