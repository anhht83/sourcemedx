import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator'

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "SecurePass123!"
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         company:
 *           type: string
 *           example: SourceMedX
 *     LoginDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "SecurePass123!"
 */
export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsOptional()
  company?: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "SecurePass123!"
 */
export class LoginDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'This field is required' })
  email: string

  @MinLength(6)
  @IsNotEmpty()
  password: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPasswordDTO:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 */
export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'This field is required' })
  email: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordDTO:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: The reset token sent to the user via email
 *           example: user@example.com
 *         newPassword:
 *           type: string
 *           format: password
 *           example: "SecurePass123!"
 */
export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'This field is required' })
  token: string

  @MinLength(6)
  @IsNotEmpty()
  newPassword: string
}
