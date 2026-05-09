import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../configs/config'
import { AppError } from '../../utils/AppError'

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.accessSecret, { expiresIn: '1d' }) // should be 15m
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: '7d' })
  }

  static verifyAccessToken(token: string = ''): any {
    try {
      return jwt.verify(token, config.jwt.accessSecret)
    } catch {
      throw new AppError('Invalid or expired access token', 401)
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.refreshSecret)
    } catch {
      throw new AppError('Invalid or expired refresh token', 403)
    }
  }
}
