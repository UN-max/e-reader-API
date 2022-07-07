const { getHistoryByIds, updateHistory, createHistory, getHistory } = require('../services/history.services')

class HistoryController {
  async create (ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const { num, time } = ctx.request.body
    // 查看数据库是否含该数据，有则更新 否则插入
    const result = await getHistoryByIds(id, bookId)
    if (result.length) {
      // 更新数据库
      const result = await updateHistory(id, bookId, num, time)
      ctx.body = result
    } else {
      const result = await createHistory(id, bookId, num, time)
      ctx.body = result
    }
  }

  async get (ctx, next) {
    const { id } = ctx.user
    const result = await getHistory(id)
    ctx.body = result
  }

  async getOne(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const result = await getHistoryByIds(id, bookId)
    ctx.body = result
  }
}

module.exports = new HistoryController()
