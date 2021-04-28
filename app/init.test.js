const request = require('supertest')
const chaiJestSnapshot = require('chai-jest-snapshot')
require('chai').use(chaiJestSnapshot)

const { defineProperty, freeze } = Object

before(async function() {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SEED = 'secret'
  process.env.JWT_EXPIRES_IN = 86400
  process.env.DATABASE_URL = 'sqlite::memory:'

  chaiJestSnapshot.resetSnapshotRegistry()
  
  const { server, db, sequelize } = await require('../app/server.js')
  
  defineProperty(this, 'server', { value: server, writable: false })
  defineProperty(this, 'db', { value: freeze(db), writable: false })
  defineProperty(this, 'sequelize', { value: sequelize, writable: false })
  defineProperty(this, 'request', { value: request(server), writable: false })
})

beforeEach(async function() {
  chaiJestSnapshot.configureUsingMochaContext(this)
  await this.sequelize.truncate()
  const user = await this.db.User.create({
    email: 'test@user.com',
    password: 'test',
  })
  this.jwt = user.generateJwt()
})

after(async function() {
  this.server.close()
})
