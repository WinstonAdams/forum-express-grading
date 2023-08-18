const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const { User, Restaurant } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 本地驗證(登入時)
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

        bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return cb(null, user)
          })
      })
  }
))

// JWT 驗證
const jwtOptions = {
  // - 設定去哪裡找 token，這裡指定 authorization header 裡的 bearer 項目
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // - 使用密鑰來檢查 token 是否經過纂改
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      //! as: 表示想要引入的關係，必須跟 user model 中設定的關聯名稱相同
      { model: Restaurant, as: 'FavoritedRestaurants' }, // action 取得 req.user.FavoritedRestaurants
      { model: Restaurant, as: 'LikedRestaurants' }, // action 取得 req.user.LikedRestaurants
      { model: User, as: 'Followers' }, // action 取得 req.user.Followers
      { model: User, as: 'Followings' } // action 取得 req.user.Followings
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
