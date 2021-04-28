const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .get('/people/:id/aliases', async (req, res, next) => {
    try {
      const person = await req.db.Person.findFullPersonById(req.params.id)
      if (!person) {
        const error = new Error(`Person ${req.params.id} not found`)
        error.status = 404
        throw error
      }
      res.json(halson({
        items: person.aliases.map(
          ({ id, name }) => halson({ alias: name })
            .addLink('self', `${req.base}${req.originalUrl}/${id}`)
        ),
      }))
    } catch(error) {
      next(error)
    }
  })
