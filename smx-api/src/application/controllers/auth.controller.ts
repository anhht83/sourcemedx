import { Request, Response, NextFunction } from 'express'
import { AuthUseCase } from '../usecases/auth.usecase'
import { AuthHelper } from '../../utils/AuthHelper'

export class AuthController {
  authUseCase: AuthUseCase

  constructor() {
    this.authUseCase = new AuthUseCase()
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorized = await this.authUseCase.register(req.body)
      res.json(authorized)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const authorized = await this.authUseCase.loginByEmail({
        email,
        password,
      })
      res.json(authorized)
    } catch (error) {
      next(error)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = AuthHelper.getAuthRefreshToken(req) // Get refreshToken from cookies
      const newAccessToken = await this.authUseCase.refreshToken(refreshToken)
      res.json({ accessToken: newAccessToken })
    } catch (error) {
      next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      AuthHelper.removeAuthRefreshToken(res)
      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resetToken = await this.authUseCase.forgotPassword(req.body.email)
      res.json({ resetToken })
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authUseCase.resetPassword(req.body.token, req.body.newPassword)
      res.json(true)
    } catch (error) {
      next(error)
    }
  }
}
