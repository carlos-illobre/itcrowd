const { INTEGER, STRING, DATE } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.createTable('Movies', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: STRING,
        allowNull: false
      },
      releaseYear: {
        type: INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DATE,
        allowNull: false
      },
      updatedAt: {
        type: DATE,
        allowNull: false
      }
    })
  },
}
