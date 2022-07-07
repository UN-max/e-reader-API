const { getMark, createMark, delMark, getAllMarks } = require('../services/bookmark.services')

class BookmarkController {
  async create(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const { num } = ctx.request.body
    const result = await getMark(id, bookId, num)
    if (result.length) {
      await delMark(id, bookId, num)
      ctx.body = false
    } else {
      await createMark(id, bookId, num)
      ctx.body = true
    }
  }

  async getAll(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const result = await getAllMarks(id, bookId)
    ctx.body = result
  }
}

module.exports = new BookmarkController()
