const { Router } = require('express')
const passport = require('passport')

module.exports = Router({mergeParams: true}).delete(
  '/people/:personId/aliases/:aliasId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const count = await req.db.Alias.delete(req.params)
    return res.sendStatus(count ? 204 : 404)
  })
