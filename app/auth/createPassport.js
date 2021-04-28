const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

module.exports = ({ db }) => passport.use(new Strategy({
  secretOrKey: process.env.JWT_SEED,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (payload, done) => {
  const user = await db.User.findByPk(payload.sub)
  done(null, user)
}))
