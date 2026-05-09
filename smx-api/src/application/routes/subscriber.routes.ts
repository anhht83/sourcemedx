import { Router } from 'express'
import { validateDTO } from '../middlewares/validateDTO'
import { SubscriberController } from '../controllers/subscriber.controller'
import { SubscriberDTO } from '../dtos/subscriber.dto'

export const subscriberRouter = Router()
const controller = new SubscriberController()

/**
 * @swagger
 * /api/subscribe:
 *   post:
 *     summary: Subscribe a user to the newsletter
 *     description:
 *     tags:
 *       - Subscriber
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SubscriberDTO"
 *     responses:
 *       201:
 *         description: User registered successfully and subscribed to the newsletterS
 *       400:
 *         description: Invalid request body
 */
subscriberRouter.post('/', validateDTO(SubscriberDTO), controller.subscribe)
