const db = require('../models')
const Restaurant = db.Restaurants
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite

//const for pagination
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues, //...展開運算子
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id),
        categoryName: r.Category.name
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      //include 清單當項目變多時需要改成用陣列
      include: [Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(restaurant => {
      //console.log(restaurant.toJSON())
      restaurant.viewCounts++
      return restaurant.save({
        fields: ['viewCounts']
      }).then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited: isFavorited,
          isLiked: isLiked
        })
      })
    })
  },

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then((restaurants) => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then((comments) => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Comment, Category]
    }).then((restaurant) => {
      let comment = restaurant.toJSON().Comments
      let commentCount = comment.length
      return res.render('dashboard', {
        restaurant: restaurant.toJSON(),
        commentCount: commentCount
      })
    })
  },

  getTopRestaurant: (req, res) => {
    // 撈出所有 Restaurant 與 favoritedUsers 資料
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      // 整理 restaurant 資料
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        // 計算收藏人數
        restaurantCount: restaurant.FavoritedUsers.length,
        // 判斷目前登入使用者是否已追蹤該 restaurant
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id),
        description: restaurant.description.substring(0, 50)
      }))
      // 依收藏數排序清單並取Top 10
      restaurants = restaurants.sort((a, b) => b.restaurantCount - a.restaurantCount)
      restaurants = restaurants.slice(0, 10)
      return res.render('top', { restaurants: restaurants })
    })
  },

}

module.exports = restController