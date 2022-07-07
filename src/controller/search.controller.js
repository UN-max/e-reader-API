const { getHotSearch, getHistory, searchAuthors, searchBooks, saveSearchHistory, searchRanking, searchAll, deleteHistory } = require('../services/search.services')

class SearchController {
  async hotSearch(ctx, next) {
    const result = await getHotSearch()
    ctx.body = result
  }

  async history(ctx, next) {
    const result = await getHistory()
    ctx.body = result
  }

  async ranking (ctx, next) {
    const result = await searchRanking()
    ctx.body = result
  }

  async search(ctx, next) {
    const { wd } = ctx.query
    // 可以从作者、书名、简介中查询。。。
    const authors = await searchAuthors(wd)
    const books = await searchBooks(wd)
    // 只是显示，并没有确认搜索
    let result = {}
    result.authors = authors
    result.books = books
    ctx.body = result
  }

  async searchList (ctx, next) {
    const { wd } = ctx.query
    const result = await searchAll(wd)
    // 将该条记录保存到数据库中
    await saveSearchHistory(wd)
    ctx.body = result
  }

  async delHistory (ctx, next) {
    await deleteHistory()
    const result = await getHistory()
    ctx.body = result
  }
}

module.exports = new SearchController()
