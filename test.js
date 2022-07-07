const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const axios = require("axios").default

async function getChapter() {
  let job = {}
  await axios.get(`https://www.bqkan8.com/25_25963/525719089.html`, { responseType: 'arraybuffer' }).then(async res=>{
    const str = iconv.decode(Buffer.from(res.data), 'gbk')
    const html = iconv.encode(str, 'utf8').toString()
    var $ = cheerio.load(html, {decodeEntities: false});
    
    job.title = $('.content').find('h1').text().trim()
    let content = $('.content').find('#content').text().replace('/<br>/', '\n')
    job.content = content.split('(https')[0].trim()
    console.log(job.content);
  })
  return job
}

getChapter().then(res => {
  console.log(res);
})
