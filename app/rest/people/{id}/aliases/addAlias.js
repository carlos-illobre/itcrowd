const { Router } = require('express')
const halson = require('halson')
const passport = require('passport')

module.exports = Router({mergeParams: true}).post(
  '/people/:id/aliases',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { id: personId } = req.params
      const { alias } = req.body
      const { id: aliasId } = await req.db.Person.addAliasByPersonId({ personId, alias })
      const location = `${req.base}/rest/people/${personId}/aliases/${aliasId}`
      res.setHeader('Location', location)
      return res.status(201).json(halson()
        .addLink('self', location)
      )
    } catch(error) {
      next(error)
    }
  })
