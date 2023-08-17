const { Restaurant, Category } = require('../models')

const adminServices = {
  // 進入管理者首頁(餐廳列表)
  getRestaurants: (req, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category] // 使用 include 取得關聯資料
    })
      .then(restaurants => callback(null, { restaurants }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
