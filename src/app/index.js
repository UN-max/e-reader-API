const Koa = require('koa')
const serve = require('koa-static')
const bodyparser = require('koa-bodyparser')

const useRouters = require('../routers')
const errorHandler = require('./error-handle')

const app = new Koa()

const staticRouter = serve(process.cwd()+'/public')

module.exports = staticRouter

app.useRouters = useRouters

// 解决跨域问题
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin','*') // 设置允许跨域的域名，*代表允许任意域名跨域
  ctx.set("Access-Control-Allow-Methods", "POST,GET,DELETE,PATCH,PUT"); // 跨域允许的请求方式
  ctx.response.status = 200 ;
  await next();
});
app.use(bodyparser())
app.useRouters()
app.use(staticRouter)
app.on('error', errorHandler)

module.exports = app
