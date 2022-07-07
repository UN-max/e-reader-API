const Router = require('koa-router')

const { getHome, getStatics, getFearture, getRanking, getCategories, guessYouLike } = require('../controller/home.controller')

const homeRouter = new Router({prefix: '/home'})

homeRouter.get('/', getHome)

// 获取静态资源
homeRouter.get('/statics', getStatics)

// 获取主编力荐图书信息
homeRouter.get('/fearture', getFearture)

// 获取排行榜信息
homeRouter.get('/ranking', getRanking)

// 获取分类精选信息
homeRouter.get('/recommend/:typeId', getCategories)

// 猜你喜欢
homeRouter.get('/guess/:page', guessYouLike)

module.exports = homeRouter
