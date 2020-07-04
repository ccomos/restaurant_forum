const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', (req, res) => res.redirect('/restaurants'))

  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', restController.getRestaurants)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)

  //user signup route controller
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //user sinin route controller
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}
