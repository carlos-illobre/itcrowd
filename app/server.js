const port = process.env.PORT || 8080

const http = require('http')

const createDatabase = require('./db/createDatabase')
const createRestApi = require('./rest/createRestApi')

module.exports = (async () => {

  const { db, sequelize } = await createDatabase()
  const restApi = await createRestApi({ db })

  return new Promise(resolve => {
    const server = http.createServer()
      .on('request', restApi)
      .on('listening', function() {
        console.log(`Listening on port ${port}`)
      })
      .listen(port, () => resolve({ server, db, sequelize }))
  })

})()
