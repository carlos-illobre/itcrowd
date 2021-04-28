const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/movies/:id/directors', async (req, res) => {
    const directors = await req.db.Movie.findDirectorsByMovieId(req.params.id)
    res.json({
      items: directors.map(
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
