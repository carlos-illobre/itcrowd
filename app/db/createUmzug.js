const Umzug = require('umzug')
const { join } = require('path')

module.exports = ({ sequelize }) => {
  return new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      path: join(__dirname, './migrations'),
      params: [sequelize.getQueryInterface()],
      pattern: /^\d+[\w-]+\.js$/,
    }
  })
}
