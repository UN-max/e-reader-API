/* const cheerio = require('cheerio');
const http = require('https');
const iconv = require('iconv-lite')
 
async function getBookInfo() {
  return new Promise((resolve) => {
    var strHtml = [];
    var results = [];
    http.get('https://www.bqkan8.com/19241_19241446/', function (res) {
      res.on('data', function (chunk) {//监听事件 传输
        strHtml.push(chunk);
      })
      res.on('end', function () {//数据传输完
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});//cheerio模块开始处理 DOM处理
        $('.book .info').each((item, i) => {//遍历处理需要爬取的数据
          var job = {};
          //爬取内容时，一定要注意标签结构。按标签结构一层一层获取。
          job.cover = 'https://www.bqkan8.com' + $(i).find(".cover > img").attr('src');
          job.name = $(i).find("h2").text().trim();
          //当一个div中有多个span标签及其他标签且没有选择器时，就要选择下标获取。eq(0)表示处于第一个span标签的内容。
          job.author = $(i).find(".small span").eq(0).text().trim().replace('作者：', '');
          job.category = $(i).find(".small span").eq(1).text().trim().replace('分类：', '');
          job.status = $(i).find(".small span").eq(2).text().trim().replace('状态：', '');
          job.word_num = $(i).find(".small span").eq(3).text().trim().replace('字数：', '');
          let intro = $(i).find(".intro").text().trim().replace('简介：', '').trim()
          job.intro = intro.split('作者')[0]
          results.push(job);
        })
        console.log(results);
        resolve(results);
      })
    })
  })
}

module.exports = {
  getBookInfo
} */







const cheerio = require('cheerio');
const http = require('https');
const iconv = require('iconv-lite')

const connection = require('./src/app/database')

const baseURL = 'https://www.bqkan8.com'
// 每个分类的 url
const urlArr = ['/xuanhuanxiaoshuo/', '/xiuzhenxiaoshuo/', '/dushixiaoshuo/', '/chuanyuexiaoshuo/', '/wangyouxiaoshuo/', '/kehuanxiaoshuo/', '/qitaxiaoshuo/', '/wanben/']

// 获取每个分类中热门推荐的6个小说的URL
async function getHotBooks(typeUrl) {
  return new Promise((resolve) => {
    var strHtml = [];
    var job = [];

    http.get(`${baseURL}${typeUrl}`, function (res) {
      res.on('data', function (chunk) {
        strHtml.push(chunk);
      })
      res.on('end', function () {
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});
        $('.wrap .hot .ll .item').each((index, el) => {
          job[index] = baseURL + $(el).find('.p10 .image a').attr('href')
        })
        resolve(job);
      })
    })
  })
}

// 获取每个分类中相关推荐的小说的URL
/* async function getRecommendBooks(typeUrl) {
  return new Promise((resolve) => {
    var strHtml = [];
    var job = [];

    http.get(`${baseURL}${typeUrl}`, function (res) {
      res.on('data', function (chunk) {
        strHtml.push(chunk);
      })
      res.on('end', function () {
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});
        $('.wrap .up .r ul li').each((index, el) => {
          job[index] = baseURL + $(el).find('.s2 a').attr('href')
        })
        resolve(job);
      })
    })
  })
} */

// 获取书的详情信息
async function getBookInfo(url) {
  return new Promise((resolve) => {
    var strHtml = [];
    var job = {};

    http.get(url, function (res) {
      res.on('data', function (chunk) {
        strHtml.push(chunk);
      })
      res.on('end', function () {
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});
  
        job.cover = baseURL + $('.book .info').find(".cover > img").attr('src');
        job.name = $('.book .info').find("h2").text().trim();
        job.author = $('.book .info').find(".small span").eq(0).text().trim().replace('作者：', '');
        job.type = $('.book .info').find(".small span").eq(1).text().trim().replace('分类：', '');
        job.status = $('.book .info').find(".small span").eq(2).text().trim().replace('状态：', '');
        job.word_num = $('.book .info').find(".small span").eq(3).text().trim().replace('字数：', '');
        let summary = $('.book .info').find(".intro").text().trim().replace('简介：', '').trim()
        job.summary = summary.split('作者')[0]

        resolve(job);
      })
    })
  })
}

async function getChapter(url) {
  return new Promise((resolve) => {
    var strHtml = [];
    var job = {};
    const fullURL = `${baseURL}${url}`
    
    http.get(fullURL, function (res) {
      res.on('data', function (chunk) {
        strHtml.push(chunk);
      })
      res.on('end', async function () {
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});
        
        const bookName = $('.path .p a').eq(1).text().trim()
        const statement = `SELECT id FROM testbooks WHERE name = ?`
        const [ result ] = await connection.execute(statement, [bookName])

        job.book_id = result[0].id

        job.title = $('.content').find('h1').text().trim()
        let content = $('.content').find('#content').text()
        job.content = content.split('(https')[0].trim()
  
        resolve(job)
      })
    })
  })
}

// 先获取章节链接,再通过章节链接换取数据
async function getChapterByLink(url) {
  return new Promise((resolve) => {
    var strHtml = [];

    http.get(`${url}`, function (res) {
      res.on('data', function (chunk) {
        strHtml.push(chunk);
      })
      res.on('end', function () {
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});
        let arr = []
        
        $('.listmain dl dt').eq(1).nextAll('dd').each((index, el) => {
          arr.push(getChapter($(el).find('a').attr('href')).then(res => {
            res.chapter_num = index + 1
            console.log(res.chapter_num, res.title);
            return new Promise((resolve) => resolve(res))
          }))
        })
        
        Promise.all([...arr]).then(res => {
          resolve(res)
        })
      })
    })
  })
}

urlArr.forEach(item => {
  getHotBooks(item).then(res => {
    res.forEach(item => {
      getBookInfo(item).then(async res => {
        const statement = `
          INSERT INTO testbooks (cover, name, author, type, status, summary, word_num) VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        try {
          await connection.execute(statement, [res.cover, res.name, res.author, res.type, res.status, res.summary, res.word_num])
        } catch (error) {
          console.log(error);
        }
      })
      getChapterByLink(item).then(res => {
        const statament = `
        INSERT INTO testchapters (book_id, title, content, chapter_num) VALUES (?, ?, ?, ?)
        `
        res.forEach(async item => {
          console.log(item.title);
          try {
            const result = await connection.execute(statament, [item.book_id, item.title, item.content, item.chapter_num])
            console.log(result[0]);
          } catch (error) {
            console.log(error);
          }
        });
      })
    })
  })
})















// getChapter().then(async (res) => {
//   const statament = `
//   INSERT INTO testchapter (book_id, title, content, chapter_num) VALUES (?, ?, ?, ?)
//   `
//   const result = await connection.execute(statament, [res.cover, res.name, res.author, res.type, res.status, res.summary, res.word_num])
//   console.log(result[0]);
// })