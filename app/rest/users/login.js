const { Router } = require('express')
const halson = require('halson')

module.exports = Router({mergeParams: true})
  .post('/users/login', async (req, res, next) => {
    try {
      const user = await req.db.User.findByEmailAndPassword(req.body)
      if (!user) {
        const error = new Error('Unauthorized')
        error.status = 401
        throw error
      }
      res.status(201).json(halson({ accessToken: user.generateJwt() })
        .addLink('movies', `${req.base}/rest/movies`)
        .addLink('people', `${req.base}/rest/people`)
      )
    } catch(error) {
      next(error)
    }
  })
