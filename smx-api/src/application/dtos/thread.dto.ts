import { IsNotEmpty } from 'class-validator'

/**
 * @swagger
 * components:
 *   schemas:
 *     ThreadDTO:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           example: "thread-123"
 */
export class ThreadDTO {
  @IsNotEmpty()
  id: string
}
