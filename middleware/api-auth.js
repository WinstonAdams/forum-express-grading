const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  //! passport.authenticate
  const middleware = passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    // 因為有傳入 callback，所以要額外處理驗證成功的時候 user 放入 req.user
    req.user = user
    next()
  })

  middleware(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()

  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
