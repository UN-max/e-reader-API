const { getCategories, getBooksByTypeId } = require('../services/category.services')

class CategoryController {
  async category (ctx, next) {
    const result = await getCategories()
    ctx.body = result
  }

  async getBooks (ctx, next) {
    const { typeId } = ctx.params
    const result = await getBooksByTypeId(typeId)
    ctx.body = result
  }
}

module.exports = new CategoryController()
