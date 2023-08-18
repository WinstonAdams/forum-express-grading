const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const { apiErrorHandler } = require('../../middleware/error-handler')
const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')

router.use('/admin', admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 關閉 session 功能 (不會做序列化和反序列化)，req.user 改成拿到比對使用者密碼後回傳的 user

router.get('/restaurants', restController.getRestaurants)

router.use('/', apiErrorHandler)

module.exports = router
