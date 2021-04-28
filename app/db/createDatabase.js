const { Sequelize, DataTypes } = require('sequelize')
const { sync } = require('glob')
const { chain, isFunction } = require('lodash')

const createUmzug = require('./createUmzug.js')

module.exports = async () => {

  const sequelize = new Sequelize(process.env.DB_URI)

  await createUmzug({ sequelize }).up()

  chain(sync('./models/**/*.js', {
    cwd: __dirname,
    ignore: ['./models/**/*.test.js'],
  }))
    .map(filename => require(filename))
    .filter(isFunction)
    .map(fn => fn({ sequelize, DataTypes }))
    .filter(model => model.associate)
    .forEach(model => model.associate(sequelize.models))
    .value()

  return {
    db: sequelize.models,
    sequelize,
  }
}
