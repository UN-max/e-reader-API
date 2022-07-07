const Router = require('koa-router')

const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { myList, list, create, del, update } = require('../controller/comment.controller')
const commentRouter = new Router({prefix: '/comment'})

// 获取某个用户的评论
commentRouter.get('/', verifyAuth, myList)

// 获取某本书的评论列表
commentRouter.get('/:bookId', list)

// 发表书评
commentRouter.post('/', verifyAuth, create)

// 删除书评
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, del)

// 修改书评
commentRouter.post('/:commentId', verifyAuth, verifyPermission, update)

module.exports = commentRouter
