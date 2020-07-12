const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const restaurants = require('../models/restaurants')
const User = db.User
const Restaurant = db.Restaurants

//setup passport strategy
passport.use(new LocalStrategy(
  //customize user field
  {
    usernameField: 'email',
    passwordFiedl: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user, 序列化只轉換資料提取user_id 節省session空間, 反序列化由user_id提取整個user物件
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport