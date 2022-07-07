const cheerio = require('cheerio');
const http = require('https');
const iconv = require('iconv-lite')

const connection = require('./src/app/database')
 
async function getBookInfo() {
  return new Promise((resolve) => {
    var strHtml = [];
    var job = {};

    http.get('https://www.bqkan8.com/30_30398/', function (res) {
      res.on('data', function (chunk) {
        strHtml.push(chunk);
      })
      res.on('end', function () {
        strHtml = iconv.decode(Buffer.concat(strHtml), 'gbk')
        var $ = cheerio.load(strHtml, {decodeEntities:false});
  
        job.cover = 'https://www.bqkan8.com' + $('.book .info').find(".cover > img").attr('src');
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

getBookInfo().then(async (res) => {
  const statament = `
  INSERT INTO books (cover, name, author, type, status, summary, word_num) VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  const result = await connection.execute(statament, [res.cover, res.name, res.author, res.type, res.status, res.summary, res.word_num])
  console.log(result[0]);
})
