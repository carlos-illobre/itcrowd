const { Router } = require('express')
const passport = require('passport')

module.exports = Router({mergeParams: true}).patch(
  '/movies/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const [count] = await req.db.Movie.update(req.body, { where: { id: req.params.id } })
      if (!count) {
        const error = new Error(`Movie ${req.params.id} not found`)
        error.status = 404
        throw error
      }
      res.sendStatus(204)
    } catch(error) {
      next(error)
    }
  })
