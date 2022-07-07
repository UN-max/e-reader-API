const Router = require('koa-router')

const { bookInfo, directory, content } = require('../controller/books.controller')

const booksRouter = new Router({prefix: '/books'})

// 获取单本书籍的基本信息
booksRouter.get('/:bookId', bookInfo)

// 获取单本书籍的目录
booksRouter.get('/:bookId/directory', directory)

// 获取书籍的章节内容
booksRouter.get('/:bookId/directory/:chapterNum', content)

module.exports = booksRouter
