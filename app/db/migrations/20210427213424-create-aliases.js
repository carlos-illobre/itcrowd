const { INTEGER, STRING, DATE } = require('sequelize')

module.exports = {
  up: async (query) => {
    await query.createTable('Aliases', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false
      },
      createdAt: {
        type: DATE,
        allowNull: false
      },
      updatedAt: {
        type: DATE,
        allowNull: false
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
      },
    })
  },
}
