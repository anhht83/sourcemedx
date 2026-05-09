import { User } from '../entities'
import { IAuthResponse, IAuthToken } from '../interfaces/auth.interface'
import { UserPresenter } from './user.presenter'

export class AuthPresenter {
  /**
   * @swagger
   * components:
   *   schemas:
   *     AuthResponse:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *         email:
   *           type: string
   *           example: user@example.com
   *           format: email
   *         lastName:
   *           type: string
   *           example: Doe
   *         firstName:
   *           type: string
   *           example: John
   *         company:
   *           type: string
   *           example: SourceMedX
   *         accessToken:
   *           type: string
   *         refreshToken:
   *           type: string
   */
  static userWithTokenToView(
    { accessToken, refreshToken }: IAuthToken,
    user: User,
  ): IAuthResponse {
    const userToView = UserPresenter.toView(user)
    return {
      ...userToView,
      accessToken,
      refreshToken,
    }
  }
}
