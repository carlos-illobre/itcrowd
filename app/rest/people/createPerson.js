const { Router } = require('express')
const halson = require('halson')
const passport = require('passport')

module.exports = Router({mergeParams: true}).post(
  '/people',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const person = await req.db.Person.create(req.body)
    const location = `${req.base}${req.originalUrl}/${person.id}`
    res.setHeader('Location', location)
    return res.status(201).json(halson()
      .addLink('self', location)
      .addLink('aliases', `${location}/aliases`)
      .addLink('moviesAsActor', `${req.base}/rest/movies?actorId=${person.id}`)
      .addLink('moviesAsDirector', `${req.base}/rest/movies?directorId=${person.id}`)
      .addLink('moviesAsProducer', `${req.base}/rest/movies?producerId=${person.id}`)
    )
  })
