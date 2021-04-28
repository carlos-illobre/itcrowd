const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/movies/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      const movie = await req.db.Movie.findFullMovieById(id)

      if (!movie) {
        const error = new Error(`Movie ${id} not found`)
        error.status = 404
        throw error
      }

      res.json(halson(movie.toJSON())
        .addLink('self', `${req.base}${req.originalUrl}`)
        .addLink('casting', `${req.base}${req.originalUrl}/casting`)
        .addLink('producers', `${req.base}${req.originalUrl}/producers`)
        .addLink('directors', `${req.base}${req.originalUrl}/directors`)
      )
    } catch(error) {
      next(error)
    }
  })
