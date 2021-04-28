const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/people', async (req, res) => {
    const people = await req.db.Person.findAll()

    res.json({
      items: people.map(
        ({ id, firstName, lastName }) => halson({
          firstName,
          lastName,
        })
          .addLink('self', `${req.base}${req.originalUrl}/${id}`)
          .addLink('aliases', `${req.base}${req.originalUrl}/${id}/aliases`)
          .addLink('moviesAsActor', `${req.base}/rest/movies?actorId=${id}`)
          .addLink('moviesAsDirector', `${req.base}/rest/movies?directorId=${id}`)
          .addLink('moviesAsProducer', `${req.base}/rest/movies?producerId=${id}`)
      ),
    })
  })
