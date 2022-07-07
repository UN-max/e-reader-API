const { baseURL } = require('../constants/const')
const connection = require('../app/database')

class HomeServices {
  async getStaticsInfo() {
    const statement = `
    SELECT * FROM statics
    `
    try {
      let [ result ] = await connection.execute(statement)
      let statics = {}
      let banners = []
      let navs = []
      let tabs = []
      result.forEach(item => {
        item.url = `${baseURL}${item.url}`
        if (item.type === 'banner') {
          banners.push(item)
        } else if (item.type === 'nav') {
          navs.push(item)
        } else {
          tabs.push(item)
        }
      })
      statics.banners = banners
      statics.navs = navs
      statics.tabs = tabs
      return statics
    } catch (error) {
      console.log(error);
    }
  }

  async getFeartureInfo() {
    const statement = `
      SELECT b.id id, name, author, type, b.cover cover
      FROM books b
      LEFT JOIN categories c ON c.id = b.type_id
      WHERE score >= 9.5 ORDER BY RAND()
      LIMIT 0,3;
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getRankingInfo() {
    const statement = `
      SELECT b.id id, name, type, status, FORMAT(word_num/10000, 0) wordNum, b.cover cover
      FROM books b
      LEFT JOIN categories c ON b.type_id = c.id
      ORDER BY score DESC
      LIMIT 0,50;
    `
    try {
      const [ result ] = await connection.execute(statement)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getCategoriesInfo(typeId) {
    const statement = `
      SELECT b.id id, name, author, summary, score, cover
      FROM books b
      WHERE type_id = ? ORDER BY score DESC
      LIMIT 0,9;
    `
    try {
      const [ result ] = await connection.execute(statement, [typeId])
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async guessYouLikeInfo(page) {
    const statement = `
      SELECT b.id id, name, author, type, score, summary, b.cover cover
      FROM books b
      LEFT JOIN categories c ON c.id = b.type_id
      ORDER BY b.cover DESC
      LIMIT ?, 20
    `
    try {
      const [ result ] = await connection.execute(statement, [page * 20])
      return result
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new HomeServices()

