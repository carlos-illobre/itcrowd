const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .post('/users', async (req, res, next) => {
    try {
      await req.db.User.create(req.body)
      res.status(201).json(halson()
        .addLink('login', `${req.base}${req.originalUrl}/login`)
      )
    } catch(error) {
      next(error)
    }
  })
