const { getList, getMyList, createComment, delComment, updateComment } = require('../services/comment.services')

class CommentController {
  async list(ctx, next) {
    const { bookId } = ctx.params
    const result = await getList(bookId)
    ctx.body = result
  }

  async myList(ctx, next) {
    const { id } = ctx.user
    const result = await getMyList(id)
    ctx.body = result
  }

  async create(ctx, next) {
    const { id } = ctx.user
    const { bookId, content } = ctx.request.body
    const result = await createComment(id, bookId, content)
    ctx.body = result
  }

  async del(ctx, next) {
    const { commentId } = ctx.params
    const result = await delComment(commentId)
    ctx.body = result
  }

  async update(ctx, next) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    const result = await updateComment(commentId, content)
    ctx.body = result
  }
}

module.exports = new CommentController()
