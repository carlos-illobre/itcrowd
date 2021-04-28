const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/movies/:id/producers', async (req, res) => {
    const producers = await req.db.Movie.findProducersByMovieId(req.params.id)
    res.json({
      items: producers.map(
        ({ id, firstName, lastName }) => halson({
          firstName,
          lastName,
        })
          .addLink('self', `${req.base}/rest/people/${id}`)
          .addLink('moviesAsActor', `${req.base}/rest/movies?actorId=${id}`)
          .addLink('moviesAsDirector', `${req.base}/rest/movies?directorId=${id}`)
          .addLink('moviesAsProducer', `${req.base}/rest/movies?producerId=${id}`)
      ),
    })
  })
