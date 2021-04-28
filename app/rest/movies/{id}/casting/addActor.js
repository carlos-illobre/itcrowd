const { Router } = require('express')
const halson = require('halson')
const passport = require('passport')

module.exports = Router({mergeParams: true}).post(
  '/movies/:id/casting',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const movieId = req.params.id
      const { id: actorId }  = await req.db.Movie.addActor(movieId, req.body)
      const location = `${req.base}/rest/people/${actorId}`
      res.setHeader('Location', location)
      return res.status(201).json(halson()
        .addLink('self', location)
        .addLink('remove', `${req.base}/rest/movies/${movieId}/casting/${actorId}`)
        .addLink('movie', `${req.base}/rest/movies/${movieId}`)
      )
    } catch(error) {
      next(error)
    }
  })
