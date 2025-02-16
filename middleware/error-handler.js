module.exports = {
  // 錯誤處理的 middleware 必須要有 err, req, res, next 這四個參數
  generalErrorHandler (err, req, res, next) {
    // - err 是否為一個實例(物件)，若是，有屬性 name 和 message； 若否，err 可能是字串
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }

    res.redirect('back') //! 重新導向錯誤發生的前一頁(依靠的是 Request Header 裡的 Referer 參數)
    next(err) // - 可以把 Error 物件傳給下一個 error handler
  },

  // API 的錯誤處理
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
