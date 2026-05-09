import { Request, Response, NextFunction } from 'express'
import passport from '../../configs/passport'
import { User } from '../entities'

// Custom middleware to authenticate JWT
export const auth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: User) => {
    if (err || !user || !user.isActive) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    req.user = user as User // Attach user to request
    next()
  })(req, res, next)
}
