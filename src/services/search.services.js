const connection = require('../app/database')

class SearchServices {
  async getHotSearch() {
    const statement = `SELECT * FROM hot_search;`
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getHistory() {
    const statement = `SELECT * FROM histories ORDER BY id DESC LIMIT 0,8;`
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async searchRanking() {
    const statement = `
      SELECT b.id id, name, type, status, FORMAT(word_num/10000, 0) wordNum, b.cover cover
      FROM books b
      LEFT JOIN categories c ON b.type_id = c.id
      ORDER BY score DESC
      LIMIT 0,10;
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async searchAuthors (wd) {
    const statement = `
      SELECT id, author FROM books WHERE author LIKE '%${wd}%' ORDER BY score DESC LIMIT 0,3;
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }
  
  async searchBooks (wd) {
    const statement = `
      SELECT id, name FROM books WHERE name LIKE '%${wd}%' ORDER BY score DESC LIMIT 0,10;
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async saveSearchHistory(wd) {
    const statement1 = `SELECT * FROM histories WHERE content = ?`
    const [ result1 ] = await connection.execute(statement1, [wd])
    if (result1.length) {
      const statement = `DELETE FROM histories WHERE content = ?`
      await connection.execute(statement, [wd])
    }
    const statement = `INSERT INTO histories (content) VALUES (?)`
    try {
      const [ result ] = await connection.execute(statement, [wd])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async searchAll(wd) {
    const statement = `
      SELECT b.id id, name, author, type, status, FORMAT(word_num/10000, 0) wordNum, summary, b.cover cover
      FROM books b
      LEFT JOIN categories c ON b.type_id = c.id
      WHERE b.author LIKE '%${wd}%' OR b.name LIKE '%${wd}%' OR b.summary LIKE '%${wd}%';
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async deleteHistory() {
    const statement = `DELETE FROM histories`
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new SearchServices()
