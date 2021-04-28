module.exports = ({ sequelize, DataTypes }) => {
  const Person = sequelize.define('Person', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'The first name is mandatory'
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'The last name is mandatory'
        },
      },
    },
  })

  Person.associate = ({ Movie, Alias }) => {
    Person.belongsToMany(Movie, {
      through: 'Casting',
      as: 'casting',
    })
    Person.belongsToMany(Movie, {
      through: 'Director',
      as: 'directors',
    })
    Person.belongsToMany(Movie, {
      through: 'Producer',
      as: 'producers',
    })
    Person.hasMany(Alias, { as: 'aliases' })
  }

  Person.findFullPersonById = async function(id) {
    return Person.findByPk(id, { include: 'aliases' })
  }

  Person.addAliasByPersonId = async function({ personId, alias }) {
    const person = await Person.findByPk(personId, { include: 'aliases' })
    if (!person) {
      const error = new Error(`Person ${personId} not found.`)
      error.status = 404
      throw error
    }
    return person.aliases.find(({ name }) => name == alias)
      || person.createAlias({ name: alias })
  }

  return Person
}
