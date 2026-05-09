import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt'
import passport from 'passport'
import { config } from './config'
import { userRepository } from '../application/repositories/user.repository'

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.accessSecret,
}

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await userRepository.findById(jwt_payload.userId)

      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (error) {
      return done(error, false)
    }
  }),
)

export default passport
