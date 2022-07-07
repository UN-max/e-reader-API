const { getBookInfo, getDirectory, getContent } = require('../services/books.services')

class BooksController {
  async bookInfo(ctx, next) {
    const { bookId } = ctx.params
    let result = await getBookInfo(bookId)
    ctx.body = result
  }

  async directory(ctx, next) {
    const { bookId } = ctx.params
    const result = await getDirectory(bookId)
    ctx.body = result
  }

  async content(ctx, next) {
    const { bookId, chapterNum } = ctx.params
    let result = await getContent(bookId, chapterNum)
    try {
      result.forEach(item => {
        // item.content = item.content.replace(/　　/g, '\n').replace(/       /g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '\n')
        let content = item.content.replace(/<p>/g, '').replace(/<\/p>/g, '\n').replace(/\s+/g, '\n')
        item.content = '　　' + content.replace(/\n/g, '\n　　')
      })
      ctx.body = result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new BooksController()
