import { Router } from 'express'
import { validateDTO } from '../middlewares/validateDTO'
import { ChatDTO } from '../dtos/chat.dto'
import { ChatController } from '../controllers/chat.controller'
import { auth } from '../middlewares/auth'

export const chatRouter = Router()
const controller = new ChatController()

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to the chatbot
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChatDTO"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ChatMessageResponse"
 */
chatRouter.post('/', validateDTO(ChatDTO), auth, controller.newMessage)

chatRouter.post('/embedding', controller.generateEmbedding)
