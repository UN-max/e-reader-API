const { getStaticsInfo, getFeartureInfo, getRankingInfo, getCategoriesInfo, guessYouLikeInfo } = require('../services/home.services')

class HomeController {
  async getStatics (ctx, next) {
    const homeInfo = await getStaticsInfo()
    ctx.body = homeInfo
  }

  async getFearture (ctx, next) {
    const recommendInfo = await getFeartureInfo()
    ctx.body = recommendInfo
  }

  async getRanking (ctx, next) {
    const rankingInfo = await getRankingInfo()
    ctx.body = rankingInfo
  }

  async getCategories (ctx, next) {
    const { typeId } = ctx.params
    const categoriesInfo = await getCategoriesInfo(typeId)
    ctx.body = categoriesInfo
  }

  async guessYouLike(ctx, next) {
    const { page } = ctx.params
    // 获取到猜你喜欢的数据
    let result = await guessYouLikeInfo(page)
    ctx.body = result
  }

  async getHome (ctx, next) {
    const statics = await getStaticsInfo()
    const featured = await getFeartureInfo()
    const ranking = await getRankingInfo()
    let result = {}
    result.statics = statics
    result.featured = featured
    result.ranking = ranking
    ctx.body = result
  }
}

module.exports = new HomeController()
