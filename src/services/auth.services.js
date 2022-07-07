const connection = require('../app/database')

class AuthServices {
  async checkResource(tableName, resourceId, userId) {
    const statement = `
      SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;
    `
    try {
      const [ result ] = await connection.execute(statement, [resourceId, userId])
      return result.length ? true : false
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthServices()
