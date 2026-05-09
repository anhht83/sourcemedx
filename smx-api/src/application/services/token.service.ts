import { ETokenType } from '../enums/token.enum'
import { tokenRepository } from '../repositories/token.repository'
import { v4 as uuidv4 } from 'uuid'
import { Token } from '../entities'
import { AppError } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'

export class TokenService {
  static async generateToken(
    userId: string,
    tokenType: ETokenType,
    durationHours: number = 24,
  ): Promise<string> {
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000)
    await tokenRepository.save({
      userId,
      token,
      tokenType,
      expiresAt: expiresAt,
    })
    return token
  }

  static async validateToken(token: string): Promise<Token> {
    const tokenEntity = await tokenRepository.findOneBy({ token })
    if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
      throw new AppError('Invalid or expired token.', StatusCodes.BAD_REQUEST)
    }

    return tokenEntity
  }
}
