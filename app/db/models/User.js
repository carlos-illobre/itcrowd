const { hash, compare } = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = ({ sequelize, DataTypes }) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        notNull: true,
      }
    },
    password: {
      type: DataTypes.STRING,
    }
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await hash(user.password, 10)
      },
    },
  })

  User.findByEmailAndPassword = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } })
    return user && await compare(password, user.password) ? user : null
  }

  User.prototype.generateJwt = function() {
    return jwt.sign({
      sub: this.id,
    }, process.env.JWT_SEED, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
  }

  return User
}
