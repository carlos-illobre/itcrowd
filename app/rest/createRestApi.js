const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const validator = require('swagger-express-validator')

const router = require('./createRouter')()
const createPassport = require('../auth/createPassport')

module.exports = async ({ db }) => {

  const schema = swaggerJSDoc({
    swaggerDefinition: {
      info: { title: 'Api Documentation', version: '1.0.0' },
      basePath: '/rest'
    },
    apis: ['./app/rest/**/*.yml'],
  })

  const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/rest/docs', swaggerUi.serve, swaggerUi.setup(schema, true))
    .use((req, res, next) => {
      req.base = `${req.protocol}://${req.get('host')}`
      req.db = db
      return next()
    })
    .use(createPassport({ db }).initialize())
    .use(validator({
      schema,
      returnRequestErrors: true,
      returnResponseErrors: true,
    }))
    .use('/rest', router)
    .use((error, req, res, next) => {
      if (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
        error.status = 400
      }
      res.status(error.status).json({
        error: {
          ...error,
          message: error.message,
        }
      })
    })
    
  return Promise.resolve(app)
}
