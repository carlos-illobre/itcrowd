const { INTEGER, DATE } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.createTable('Casting', {
      MovieId: {
        allowNull: false,
        type: INTEGER,
        references: {
          model: {
            tableName: 'Movies',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      PersonId: {
        allowNull: false,
        type: INTEGER,
        references: {
          model: {
            tableName: 'People',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
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
