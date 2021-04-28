const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/movies/:id/casting', async (req, res) => {
    const casting = await req.db.Movie.findCastingByMovieId(req.params.id)
    res.json({
      items: casting.map(
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
