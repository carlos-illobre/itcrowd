const { Router } = require('express')
const halson = require('halson')
const passport = require('passport')

module.exports = Router({mergeParams: true}).post(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const movie = await req.db.Movie.create(req.body)
    const location = `${req.base}${req.originalUrl}/${movie.id}`
    res.setHeader('Location', location)
    return res.status(201).json(halson()
      .addLink('self', location)
      .addLink('casting', `${location}/casting`)
      .addLink('directors', `${location}/directors`)
      .addLink('producers', `${location}/producers`)
    )
  })
