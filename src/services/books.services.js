const connection = require('../app/database')

class BookServices {
  async getBookInfo(id) {
    const statement = `
    SELECT b.id id, name, author, type, score, status,
      (SELECT MAX(chapter_num) FROM chapters WHERE book_id = b.id) totalChapters,
      FORMAT(word_num/10000, 0) wordNum, summary, b.cover cover
    FROM books b
    LEFT JOIN categories c ON c.id = b.type_id
    WHERE b.id = ?;
    `
    try {
      const [ result ] = await connection.execute(statement, [id])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getDirectory(id) {
    const statement = `
      SELECT chapter_num id, title
      FROM chapters
      WHERE book_id = ? ORDER BY chapter_num;
    `
    try {
      const [ result ] = await connection.execute(statement, [id])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getContent(bookId, chapterNum) {
    const statement = `
      SELECT title, (SELECT status FROM books WHERE id = ${bookId}) status, chapter_num chapterNum, (SELECT MAX(chapter_num) FROM chapters WHERE book_id = ${bookId}) totalChapters, content
      FROM chapters
      WHERE book_id = ? AND chapter_num = ?
    `
    try {
      const [ result ] = await connection.execute(statement, [bookId, chapterNum])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async updateBookScore(bookId, score) {
    const statement = `UPDATE books SET score = ? WHERE id = ?`
    try {
      const [ result ] = await connection.execute(statement, [score, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new BookServices()
