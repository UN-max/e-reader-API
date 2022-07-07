const { total, getRate, updateRate, createRate, calcNum } = require('../services/rate.services')
const { updateBookScore } = require('../services/books.services')

class RateController {
  async rate(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const result = await getRate(id, bookId)
    if (result.length) {
      ctx.body = result[0].score
    } else {
      ctx.body = 0
    }
  }

  async create(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const { score } = ctx.request.body
    const result = await getRate(id, bookId)
    if (result.length) {
      // 更新用户评分
      await updateRate(id, bookId, score)
    } else {
      // 新建用户评分
      await createRate(id, bookId, score)
    }
    const sum = await total(bookId)
    // 将最新评分保存到数据库
    await updateBookScore(bookId, sum)
    ctx.body = sum
  }

  async calc(ctx, next) {
    const { bookId } = ctx.params
    const result = await calcNum(bookId)
    ctx.body = result
  }
}

module.exports = new RateController()
