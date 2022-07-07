const connection = require('../app/database')

class CommentServices {
  async getList(bookId) {
    const statement = `
      SELECT c.id id, name, c.user_id userId, content, c.updateAt time
      FROM comments c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE book_id = ? ORDER BY c.updateAt DESC
    `
    try {
      const [ result ] = await connection.execute(statement, [bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getMyList(userId) {
    const statement = `
      SELECT c.id id, u.name nickname, content, b.name, author, type, c.updateAt time, b.cover cover
      FROM comments c
      LEFT JOIN books b ON b.id = c.book_id
      LEFT JOIN categories cs ON cs.id = b.type_id
      LEFT JOIN users u ON u.id = c.user_id
      WHERE user_id = ? ORDER BY c.updateAt DESC
    `
    try {
      const [ result ] = await connection.execute(statement, [userId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async createComment(userId, bookId, content) {
    const statement = `INSERT INTO comments (user_id, book_id, content) VALUES (?, ?, ?)`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId, content])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async delComment(commentId) {
    const statement = `DELETE FROM comments WHERE id = ?;`
    try {
      const [ result ] = await connection.execute(statement, [commentId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async updateComment(commentId, content) {
    const statement = `
      UPDATE comments SET content = ? WHERE id = ?;
    `
    try {
      const [ result ] = await connection.execute(statement, [content, commentId])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CommentServices()
