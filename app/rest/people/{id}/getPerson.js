const { Router } = require('express')
const halson = require('halson')
const { pick } = require('lodash')

module.exports = Router({mergeParams: true})
  .get('/people/:id', async (req, res, next) => {
    try {

      const { id } = req.params
      const person = await req.db.Person.findByPk(id)

      if (!person) {
        const error = new Error(`Person ${id} not found`)
        error.status = 404
        throw error
      }
      
      res.json(
        halson(pick(person, ['firstName', 'lastName']))
          .addLink('self', `${req.base}${req.originalUrl}`)
          .addLink('aliases', `${req.base}${req.originalUrl}/aliases`)
          .addLink('moviesAsActor', `${req.base}/rest/movies?actorId=${person.id}`)
          .addLink('moviesAsDirector', `${req.base}/rest/movies?directorId=${person.id}`)
          .addLink('moviesAsProducer', `${req.base}/rest/movies?producerId=${person.id}`)
      )
    } catch(error) {
      next(error)
    }
  })
