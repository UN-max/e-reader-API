const connection = require('../app/database')

class ShelvesServices {
  async getShelves(userId) {
    const statement = `
      SELECT b.id id, name, num, author, cover, (SELECT title FROM chapters WHERE book_id = s.book_id AND chapter_num = r.num) title
      FROM shelves s
      LEFT JOIN books b ON b.id = s.book_id
      LEFT JOIN reading_history r ON r.book_id = s.book_id AND r.user_id = s.user_id
      WHERE s.user_id = ? ORDER BY s.id DESC
    `
    try {
      const [ result ] = await connection.execute(statement, [userId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getShelvesByIds(userId, bookId) {
    const statement = `SELECT * FROM shelves WHERE user_id = ? AND book_id = ?`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result.length ? true : false
    } catch (error) {
      console.log(error);
    }
  }

  async addToShelves(userId, bookId) {
    const statement = `INSERT INTO shelves (user_id, book_id) VALUES (?, ?)`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async delBooks(userId, bookId) {
    const statement = `DELETE FROM shelves WHERE user_id = ? AND book_id = ?`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ShelvesServices()
