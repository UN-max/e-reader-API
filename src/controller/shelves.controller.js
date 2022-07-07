const { getShelves, getShelvesByIds, addToShelves, delBooks } = require('../services/shelves.services.js')

class ShelvesController {
  async getAll(ctx, next) {
    const { id } = ctx.user
    const result = await getShelves(id)
    ctx.body = result
  }

  async shelves(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const result = await getShelvesByIds(id, bookId)
    ctx.body = result
  }

  async add(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const result = await addToShelves(id, bookId)
    ctx.body = result
  }

  async del(ctx, next) {
    const { id } = ctx.user
    const { bookId } = ctx.params
    const result = await delBooks(id, bookId)
    ctx.body = result
  }
}

module.exports = new ShelvesController()
