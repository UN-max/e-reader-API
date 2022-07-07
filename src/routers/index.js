const fs = require('fs')

const useRouters = function () {
  // fs.readdirSync(__dirname) 获取当前文件的路径下的所有文件名（数组）
  fs.readdirSync(__dirname).forEach(file => {
    // console.log(file);
    if (file === 'index.js') return;
    const router = require(`./${file}`)
    this.use(router.routes())
    this.use(router.allowedMethods())
  })
}

module.exports = useRouters
