const Router = require('koa-router')

const { hotSearch, history, ranking, search, searchList, delHistory } = require('../controller/search.controller')

const searchRouter = new Router({prefix: '/search'})

// 获取搜索热词
searchRouter.get('/hot', hotSearch)

// 获取搜索历史
searchRouter.get('/history', history)

// 获取热搜书籍
searchRouter.get('/ranking', ranking)

// 模糊搜索(初略搜索)
searchRouter.get('/baseinfo', search)

// 显示搜索列表数据
searchRouter.get('/', searchList)

// 删除搜索历史
searchRouter.delete('/', delHistory)

module.exports = searchRouter
