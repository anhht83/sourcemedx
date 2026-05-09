import { Router } from 'express'

import { ThreadController } from '../controllers/thread.controller'
import { auth } from '../middlewares/auth'
import { validateDTO } from '../middlewares/validateDTO'
import { ThreadDTO } from '../dtos/thread.dto'

export const threadRouter = Router()
const controller = new ThreadController()

/**
 * @swagger
 * /api/threads:
 *   get:
 *     summary: Get all threads
 *     tags:
 *       - Thread
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ChatThreadResponse"
 */
threadRouter.get('/', auth, controller.fetchThreads)

/**
 * @swagger
 * /api/threads/{id}:
 *   get:
 *     summary: Get a thread by ID
 *     tags:
 *       - Thread
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the thread to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ChatThreadResponse"
 */
threadRouter.get('/:id', validateDTO(ThreadDTO), auth, controller.getThread)

/**
 * @swagger
 * /api/threads/{id}/generate-report:
 *   get:
 *     summary: Generate a report for a search
 *     tags:
 *       - Thread
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the thread to retrieve
 *         required: true
 *         schema:
 *           type: string
 */
threadRouter.get(
  '/:id/generate-report',
  validateDTO(ThreadDTO),
  auth,
  controller.generateReport,
)
