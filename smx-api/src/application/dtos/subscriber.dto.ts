import { IsEmail, IsNotEmpty } from 'class-validator'

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriberDTO:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: "abc@mail.com"
 */
export class SubscriberDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string
}
