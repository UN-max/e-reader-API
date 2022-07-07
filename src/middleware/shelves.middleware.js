const { getShelvesByIds } = require('../services/shelves.services')

const verifyShelves = async (ctx, next) => {
  const { id } = ctx.user
  const { bookId } = ctx.params
  // 查看数据库中是否此数据
  const result = await getShelvesByIds(id, bookId)
  if (!result) {
    await next()
  }
}

module.exports = {
  verifyShelves
}