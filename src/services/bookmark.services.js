const connection = require('../app/database')

class BookmarkServices {
  async getMark(userId, bookId, num) {
    const statement = `SELECT * FROM bookmark WHERE user_id = ? AND book_id = ? AND num = ?`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId, num])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async createMark(userId, bookId, num) {
    const statement = `INSERT INTO bookmark (book_id, user_id, num) VALUES (?, ?, ?)`
    try {
      const [ result ] = await connection.execute(statement, [bookId, userId, num])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async delMark(userId, bookId, num) {
    const statement = `DELETE FROM bookmark WHERE user_id = ? AND book_id = ? AND num = ?`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId, num])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async getAllMarks(userId, bookId) {
    const statement = `
      SELECT bm.id, num, title, createAt time
      FROM bookmark bm
      LEFT JOIN books b ON b.id = bm.book_id
      LEFT JOIN chapters c ON c.book_id = bm.book_id AND bm.num = c.chapter_num
      WHERE bm.user_id = ? AND bm.book_id = ? ORDER BY createAt DESC
    `
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new BookmarkServices()
