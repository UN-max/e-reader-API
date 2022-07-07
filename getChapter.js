const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const axios = require("axios").default
const connection = require('./src/app/database')
const nzhcn = require('nzh/hk')


async function getChapter(url) {
  let job = {}
  await axios.get(`https://www.bqkan8.com${url}`, { responseType: 'arraybuffer' }).then(async res=>{
    const str = iconv.decode(Buffer.from(res.data), 'gbk')
    const html = iconv.encode(str, 'utf8').toString()
    var $ = cheerio.load(html, {decodeEntities: false});
    
    const bookName = $('.path .p a').eq(1).text().trim()
    const statement = `SELECT id FROM books WHERE name = ?`
    try {
      const [ result ] = await connection.execute(statement, [bookName])
      job.book_id = result[0].id
    } catch (error) {
      console.log(error);
    }
    job.title = $('.content').find('h1').text().trim()
    let content = $('.content').find('#content').text()
    job.content = content.split('(https')[0].trim()
  })
  return job
}

async function getAll() {
  return new Promise(resolve => {
    axios.get('https://www.bqkan8.com/30_30398/', { responseType: 'arraybuffer' }).then(res=>{
      const str = iconv.decode(Buffer.from(res.data), 'gbk')
      const html = iconv.encode(str, 'utf8').toString()
      var $ = cheerio.load(html, {decodeEntities: false});
      // 遍历你要爬取的数据
      let arr = []
      $('.listmain dl dt').eq(1).nextAll('dd').each(async (index, el) => {
        // if (index < 100) {
        // if (index >= 1000 && index < 1300) {
        // if (index >= 1500 && index < 2000) {
        // if (index >= 2000 && index < 3000) {
        // if (index >= 3000 && index < 4000) {
        // if (index >= 4000 && index < 5000) {
        if (index >= 1300) {
          let text = $(el).find('a').text().trim()
          arr.push(getChapter($(el).find('a').attr('href')).then(res => {
            // if (text.substring(0, 1) === '第') {
            //   res.chapter_num = text.substring(text.indexOf('第') + 1, text.indexOf('章'))
            // } else {
            //   res.chapter_num = text.substring(0, text.indexOf('.'))
            // }
            res.chapter_num = nzhcn.decodeS(text.substring(text.indexOf('第') + 1, text.indexOf('章')).replace('两', '二'))
            // res.chapter_num = text.substring(text.indexOf('第') + 1, text.indexOf('章'))
            // res.chapter_num = text.substring(0, text.indexOf('.'))
            // res.chapter_num = text.substring(0, 4)
            console.log(res.chapter_num);
            return new Promise((resolve) => resolve(res))
          }))
        }
      })
      Promise.all([...arr]).then(res => {
        resolve(res)
      })
    })
  })
}

getAll().then(res => {
  const statament = `
  INSERT INTO chapters (book_id, title, content, chapter_num) VALUES (?, ?, ?, ?)
  `
  res.forEach(async item => {
    try {
      const result = await connection.execute(statament, [item.book_id, item.title, item.content, item.chapter_num])
    } catch (error) {
      console.log(error);
    }
    console.log(item.title);
  });
})

