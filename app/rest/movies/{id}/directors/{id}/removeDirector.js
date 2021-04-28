const { Router } = require('express')
const passport = require('passport')

module.exports = Router({mergeParams: true}).delete(
  '/movies/:movieId/directors/:directorId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const count = await req.db.Movie.removeDirector(req.params)
    return res.sendStatus(count ? 204 : 404)
  })
