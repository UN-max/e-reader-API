const connection = require('../app/database')

class CategoryServices {
  async getCategories() {
    const statement = `
      SELECT * FROM categories ORDER BY id;
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getBooksByTypeId(id) {
    const statement = `
      SELECT b.id id, name, author, type, status, score, FORMAT(word_num/10000, 0) wordNum, summary, b.cover cover
      FROM books b
      LEFT JOIN categories c ON c.id = b.type_id
      WHERE c.id = ?;
    `
    try {
      const [ result ] = await connection.execute(statement, [id])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CategoryServices()
