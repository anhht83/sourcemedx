import { User } from '../entities'
import { TUserResponse } from '../interfaces/user.interface'

export class UserPresenter {
  /**
   * @swagger
   * components:
   *   schemas:
   *     UserResponse:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *         email:
   *           type: string
   *         firstName:
   *           type: string
   *         lastName:
   *           type: string
   *         company:
   *           type: string
   *         createdAt:
   *           type: string
   *           format: date-time
   *         updatedAt:
   *           type: string
   *           format: date-time
   */
  static toView(user: User): TUserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
    }
  }
}
