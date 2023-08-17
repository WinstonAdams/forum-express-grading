const { Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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

  // 新增餐廳功能
  postRestaurant: (req, callback) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // 等同 const file = req.file

    return imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => callback(null, { restaurant: newRestaurant }))
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
