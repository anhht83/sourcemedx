import { IsNotEmpty } from 'class-validator'

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatDTO:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: "Hello, how can I help you?"
 *         threadId:
 *           type: string
 *           example: "thread-123"
 */
export class ChatDTO {
  @IsNotEmpty()
  message: string

  threadId?: string
}
