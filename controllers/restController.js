const db = require('../models')
const Restaurant = db.Restaurants
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,// ...展開運算子 (spread operator)
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}

module.exports = restController