const Router = require('koa-router')

const { category, getBooks } = require('../controller/category.controller')

const categoryRouter = new Router({prefix: '/category'})

// 获取所有分类
categoryRouter.get('/', category)

// 获取某个分类下的小说列表
categoryRouter.get('/:typeId', getBooks)

module.exports = categoryRouter
