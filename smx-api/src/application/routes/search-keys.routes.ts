import { Router } from 'express'
import { SearchKeysController } from '../controllers/search-keys.controller'
import { auth } from '../middlewares/auth'

export const searchKeysRouter = Router()

// Instantiate controller
const searchKeysController = new SearchKeysController()

/**
 * @swagger
 * /api/search-keys/me:
 *   get:
 *     summary: Get search keys by current user
 *     description: Retrieves all search keys associated with a specific user.
 *     tags:
 *       - Search Keys
 *     responses:
 *       200:
 *         description: Search keys retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
searchKeysRouter.get('/me', auth, searchKeysController.getKeysByUser)

/**
 * @swagger
 * /api/search-keys/cancel/{keyId}:
 *   post:
 *     summary: Cancel a search key
 *     description: Cancels a specific search key.
 *     tags:
 *       - Search Keys
 *     parameters:
 *       - name: keyId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Search key cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Search key not found
 */
searchKeysRouter.post('/cancel/:keyId', auth, (req, res, next) =>
  searchKeysController.cancelKey(req, res, next),
)

/**
 * @swagger
 * /api/search-keys/checkout:
 *   post:
 *     summary: Create a checkout session for search keys
 *     description: Creates a checkout session for search keys.
 *     tags:
 *       - Search Keys
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: number
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
searchKeysRouter.post('/checkout', auth, (req, res, next) =>
  searchKeysController.createCheckoutSession(req, res, next),
)

/**
 * @swagger
 * /api/search-keys/payment/{stripePaymentId}:
 *   get:
 *     summary: Get payment details by Stripe payment ID
 *     description: Retrieves payment details for a specific Stripe payment ID.
 *     tags:
 *       - Search Keys
 *     parameters:
 *       - name: stripePaymentId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
searchKeysRouter.get('/payment/:stripePaymentId', auth, (req, res, next) =>
  searchKeysController.getPurchasePaymentDetails(req, res, next),
)
