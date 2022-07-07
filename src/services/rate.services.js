const connection = require('../app/database')
const { originScore } = require('../constants/const')

class RateServices {
  async total(bookId) {
    // 所有用户的评分
    const statement = `
      SELECT score
      FROM rates
      WHERE book_id = ?
    `
    try {
      const origin = originScore.find(item => item.id === parseFloat(bookId))
      const [ result ] = await connection.execute(statement, [bookId])
      if (!result.length) {
        return origin.score
      } else {
        return Math.round((result.reduce((prev, curr) => prev + curr.score, 0) + origin.score) / (result.length + 1) * 10) / 10
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateRate(userId, bookId, score) {
    const statement = `UPDATE rates SET score = ? WHERE user_id = ? AND book_id = ?`
    try {
      const [ result ] = await connection.execute(statement, [score, userId, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async createRate(userId, bookId, score) {
    const statement = `INSERT INTO rates (user_id, book_id, score) VALUES (?, ?, ?)`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId, score])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getRate(userId, bookId) {
    const statement = `SELECT * FROM rates WHERE user_id = ? AND book_id = ?`
    try {
      const [ result ] = await connection.execute(statement, [userId, bookId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async calcNum(bookId) {
    const statement = `SELECT score FROM rates WHERE book_id = ?`
    try {
      const [ result ] = await connection.execute(statement, [bookId])
      let nice = 0
      let normal = 0
      let hate = 0
      result.forEach(item => {
        if (item.score >= 8) {
          nice += 1
        } else if (item.score >= 5) {
          normal += 1
        } else {
          hate += 1
        }
      })
      nice = nice / result.length * 100
      normal = normal / result.length * 100
      hate = hate / result.length * 100
      return [{id: 0, text: '好看', num: nice}, {id: 1, text: '一般', num: normal}, {id: 2, text: '不好看', num: hate}]
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RateServices()