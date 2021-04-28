const { Router } = require('express')
const halson = require('halson')
const passport = require('passport')

module.exports = Router({mergeParams: true}).post(
  '/movies/:id/producers',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const movieId = req.params.id
      const { id: producerId }  = await req.db.Movie.addProducer(movieId, req.body)
      const location = `${req.base}/rest/people/${producerId}`
      res.setHeader('Location', location)
      return res.status(201).json(halson()
        .addLink('self', location)
        .addLink('remove', `${req.base}/rest/movies/${movieId}/producers/${producerId}`)
        .addLink('movie', `${req.base}/rest/movies/${movieId}`)
      )
    } catch(error) {
      next(error)
    }
  })
