const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({ categories: categories, category: category.toJSON() })
          })
      } else {
        callback({ categories: categories })
      }
    })
  },

  postCategories: (req, res, callback) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({
        name: req.body.name
      }).then((category) => {
        return callback({ status: 'success', message: '' })
      })
    }
  },

}

module.exports = categoryService