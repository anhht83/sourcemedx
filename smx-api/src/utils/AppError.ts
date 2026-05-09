/**
 * @swagger
 * components:
 *   schemas:
 *     AppError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 500
 *         message:
 *           type: string
 *           example: Internal Server Error
 *         errors:
 *           type: object
 *           properties:
 *             invalidFields:
 *               type: object
 */
export interface IAppErrorResponse {
  statusCode?: number
  message?: string
  errors?: {
    invalidFields?: { [key: string]: any }
    [key: string]: any
  }
}

export class AppError extends Error {
  statusCode: number
  response: IAppErrorResponse // Extra error details
  constructor(response: IAppErrorResponse | string, statusCode: number = 500) {
    super(
      (typeof response === 'string' ? response : response.message) ||
        'Internal Server Error',
    )

    this.name = 'AppError'
    this.statusCode = statusCode
    this.response =
      typeof response === 'string' ? { message: response } : response

    Object.setPrototypeOf(this, AppError.prototype)
  }
}
