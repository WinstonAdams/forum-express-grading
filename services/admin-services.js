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
  },

  // 刪除餐廳
  deleteRestaurant: (req, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }

        return restaurant.destroy()
      })
      .then(deletedRestaurant => callback(null, { restaurant: deletedRestaurant }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
