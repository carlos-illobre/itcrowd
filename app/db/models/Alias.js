module.exports = ({ sequelize, DataTypes }) => {
  const Alias = sequelize.define('Alias', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'The alias name is mandatory'
        },
      },
    }
  })

  Alias.associate = ({ Person }) => {
    Alias.belongsTo(Person)
  }

  Alias.delete = async ({ personId, aliasId }) => {
    return Alias.destroy({
      where: {
        id: aliasId, 
        personId,
      },
      force: true,
    })
  }

  return Alias
}
