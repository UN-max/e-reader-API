const connection = require('../app/database')

class HistoryServices {
  async getHistoryByIds(userId, bookId) {
    const statement = `
      SELECT * FROM reading_history WHERE user_id = ? AND book_id = ?
    `
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async updateHistory(userId, bookId, num, time) {
    const statement = `
      UPDATE reading_history SET num = ${num}, time = '${time}' WHERE user_id = ? AND book_id = ?
    `
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async createHistory(userId, bookId, num, time) {
    const statement = `
      INSERT INTO reading_history (user_id, book_id, num, time) VALUES (?, ?, ?, ?)
    `
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId, num, time])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getHistory(userId) {
    const statement = `
      SELECT b.id id, name, num chapter, time, cover, (SELECT title FROM chapters WHERE book_id = r.book_id AND chapter_num = r.num) title
      FROM reading_history r
      LEFT JOIN books b ON b.id = r.book_id
      WHERE user_id = ? ORDER BY r.updateAt DESC
    `
    try {
      const [ result ] = await connection.execute(statement, [userId])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new HistoryServices()
