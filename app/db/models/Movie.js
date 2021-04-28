const { convertNumberToRoman } = require('cr-numeral')

module.exports = ({ sequelize, DataTypes }) => {
  const Movie = sequelize.define('Movie', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The movie title can not be empty'
        },
      },
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'The the movie release year is mandatory'
        },
      },
      get() {
        return convertNumberToRoman(this.getDataValue('releaseYear'))
      }
    },
  })

  Movie.associate = ({ Person }) => {
    Movie.belongsToMany(Person, {
      through: 'Casting',
      as: 'casting',
    })
    Movie.belongsToMany(Person, {
      through: 'Director',
      as: 'directors',
    })
    Movie.belongsToMany(Person, {
      through: 'Producer',
      as: 'producers',
    })
  }

  Movie.findMovies = async function({ actorId, directorId, producerId }) {
    const { Movie, Person } = this.sequelize.models
    const include = []
    if (actorId)    include.push({ model: Person, as: 'casting'  , where: { id: actorId    } })
    if (directorId) include.push({ model: Person, as: 'directors', where: { id: directorId } })
    if (producerId) include.push({ model: Person, as: 'producers', where: { id: producerId } })
    return Movie.findAll({ include })
  }

  Movie.addActor = async function(movieId, { firstName, lastName }) {
    const { Movie, Person } = this.sequelize.models
    const movie = await Movie.findByPk(movieId)

    if (!movie) {
      const error = new Error(`Movie ${movieId} not found.`)
      error.status = 404
      throw error
    }

    const person = await Person.findOne({ where: { firstName, lastName } })
    if (!person) return await movie.createCasting({ firstName, lastName })

    await movie.addCasting(person)
    return person
  }

  Movie.removeActor = async function({ movieId, actorId }) {
    const { Casting } = this.sequelize.models
    return Casting.destroy({
      where: {
        personId: actorId, 
        movieId,
      },
      force: true,
    })
  }

  Movie.findCastingByMovieId = async function(movieId) {
    const movie = await Movie.findByPk(movieId, {
      include: [{
        association: 'casting',
      }]
    })
    return movie.casting
  }

  Movie.addDirector = async function(movieId, { firstName, lastName }) {
    const { Movie, Person } = this.sequelize.models
    const movie = await Movie.findByPk(movieId)

    if (!movie) {
      const error = new Error(`Movie ${movieId} not found.`)
      error.status = 404
      throw error
    }

    const person = await Person.findOne({ where: { firstName, lastName } })
    if (!person) return await movie.createDirector({ firstName, lastName })

    await movie.addDirector(person)
    return person
  }

  Movie.removeDirector = async function({ movieId, directorId }) {
    const { Director } = this.sequelize.models
    return Director.destroy({
      where: {
        personId: directorId, 
        movieId,
      },
      force: true,
    })
  }

  Movie.findDirectorsByMovieId = async function(movieId) {
    const movie = await Movie.findByPk(movieId, {
      include: [{
        association: 'directors',
      }]
    })
    return movie.directors
  }

  Movie.addProducer = async function(movieId, { firstName, lastName }) {
    const { Movie, Person } = this.sequelize.models
    const movie = await Movie.findByPk(movieId)

    if (!movie) {
      const error = new Error(`Movie ${movieId} not found.`)
      error.status = 404
      throw error
    }

    const person = await Person.findOne({ where: { firstName, lastName } })
    if (!person) return await movie.createProducer({ firstName, lastName })

    await movie.addProducer(person)
    return person
  }

  Movie.removeProducer = async function({ movieId, producerId }) {
    const { Producer } = this.sequelize.models
    return Producer.destroy({
      where: {
        personId: producerId, 
        movieId,
      },
      force: true,
    })
  }

  Movie.findProducersByMovieId = async function(movieId) {
    const movie = await Movie.findByPk(movieId, {
      include: [{
        association: 'producers',
      }]
    })
    return movie.producers
  }

  Movie.findFullMovieById = async function(id) {
    return Movie.findByPk(id, {
      attributes: ['title', 'releaseYear'],
      include: [{
        association: 'casting',
        attributes: ['firstName', 'lastName'],
        through: {
          attributes: [],
        },
      }, {
        association: 'directors',
        attributes: ['firstName', 'lastName'],
        through: {
          attributes: [],
        },
      }, {
        association: 'producers',
        attributes: ['firstName', 'lastName'],
        through: {
          attributes: [],
        },
      }],
    })
  }

  return Movie
}
