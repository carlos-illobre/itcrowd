const { Router } = require('express')
const halson = require('halson')
const passport = require('passport')

module.exports = Router({mergeParams: true}).post(
  '/movies/:id/directors',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const movieId = req.params.id
      const { id: directorId }  = await req.db.Movie.addDirector(movieId, req.body)
      const location = `${req.base}/rest/people/${directorId}`
      res.setHeader('Location', location)
      return res.status(201).json(halson()
        .addLink('self', location)
        .addLink('remove', `${req.base}/rest/movies/${movieId}/directors/${directorId}`)
        .addLink('movie', `${req.base}/rest/movies/${movieId}`)
      )
    } catch(error) {
      next(error)
    }
  })
