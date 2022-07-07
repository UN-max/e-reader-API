const connection = require('../app/database')

class UserService {
  async createUser(user) {
    // console.log('将用户数据保存到数据库中：', user);
    // 将 user 存储到数据库中
    const { name, email, password } = user
    const statement = `
      INSERT INTO users (name, email, password) VALUES (?, ?, ?);
    `
    try {
      const result = await connection.execute(statement, [name, email, password])
      return result[0]
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email) {
    const statement = `SELECT * FROM users WHERE email = ?;`
    try {
      const result = await connection.execute(statement, [email])
      return result[0]
    } catch (error) {
      console.log(error);
    }
  }

  async updateName(id, value) {
    const statement = `UPDATE users SET name = ? WHERE id = ? `
    try {
      const [ result ] = await connection.execute(statement, [value, id])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async updateEmail(id, value) {
    const statement = `UPDATE users SET email = ? WHERE id = ? `
    try {
      const [ result ] = await connection.execute(statement, [value, id])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async updatePassword(id, value) {
    const statement = `UPDATE users SET password = ? WHERE id = ?`
    try {
      const [ result ] = await connection.execute(statement, [value, id])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async judgePassword(userId, password) {
    const statement = `SELECT * FROM users WHERE id = ? AND password = ?`
    try {
      const [ result ] = await connection.execute(statement, [userId, password])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserService()
