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
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({
        name: req.body.name
      }).then((category) => {
        return callback({ status: 'success', message: '' })
      })
    }
  },

  putCategories: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          console.log(category)
          category.update(req.body) // =category.update({name:req.body.name})
            .then((category) => {
              return callback({ status: 'success', message: 'category was successfully updated' })
            })
        })
    }
  },

  deleteCategories: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            return callback({ status: 'success', message: 'category was successfully updated' })
          })
      })
  },

}

module.exports = categoryService