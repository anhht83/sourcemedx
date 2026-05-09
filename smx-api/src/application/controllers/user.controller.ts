import { Request, Response, NextFunction } from 'express'

// get current user
export class UserController {
  me = (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}
