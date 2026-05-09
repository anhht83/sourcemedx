import { Token } from '../entities'
import { BaseRepository } from './base.repository'

export class TokenRepository extends BaseRepository<Token> {
  constructor() {
    super(Token)
  }
}

export const tokenRepository = new TokenRepository()
