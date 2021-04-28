const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/movies', async (req, res) => {
    const movies = await req.db.Movie.findMovies(req.query)
    res.json({
      items: movies.map(
        ({ id, title, releaseYear }) => halson({
          title,
          releaseYear,
        })
          .addLink('self', `${req.base}${req.baseUrl}${req.route.path}/${id}`)
          .addLink('casting', `${req.base}${req.baseUrl}${req.route.path}/${id}/casting`)
          .addLink('directors', `${req.base}${req.baseUrl}${req.route.path}/${id}/directors`)
          .addLink('producers', `${req.base}${req.baseUrl}${req.route.path}/${id}/producers`)
      ),
    })
  })
