import { TUserResponse } from './user.interface'

export interface IAuthToken {
  accessToken: string
  refreshToken?: string
}

export interface IAuthResponse extends TUserResponse, IAuthToken {}
