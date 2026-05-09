import { ETokenType } from '../enums/token.enum'

export interface IToken {
  id?: string
  token: string
  tokenType: ETokenType
  userId: string
  expiresAt?: Date
  createdAt?: Date
  updatedAt?: Date
}
