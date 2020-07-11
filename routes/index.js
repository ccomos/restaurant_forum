const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  //設定user authenticate
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      //console.log('authenticated ===', req._passport.session)
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  const authenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.id === Number(req.params.id)) { return next() }
      return res.redirect(`/users/${req.user.id}`)
    }
    res.redirect('/signin')
  }

  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  //comments route
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //admin user route
  app.get('/admin', authenticatedAdmin, (req, res) => res.render('admin/workdesk'))
  //admin user manage restaurant data route
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  //admin user manage user data route
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)
  //admin user manage categories data route
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategories)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategories)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategories)

  //user signup route controller
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //user sinin route controller
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  //user profile route controller
  app.get('/users/:id', authenticatedUser, userController.getUser)
  app.get('/users/:id/edit', authenticatedUser, userController.editUser)
  app.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser) //must to add middleware of upload.single('') because of enctype="multipart/form-data"
}
