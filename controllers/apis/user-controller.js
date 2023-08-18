const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON() // req.user 改成拿到驗證使用者密碼後回傳的 user
      delete userData.password // 密碼不應該被回傳到前端

      // 簽發 JWT token (效期為 30 天)
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
