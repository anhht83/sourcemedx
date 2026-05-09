import { Router } from 'express'
import { DataController } from '../controllers/data.controller'

export const dataRouter = Router()
const controller = new DataController()

/**
 * @swagger
 * /api/data/sync-gudid:
 *   post:
 *     summary: Sync GUDID data
 *     description: Sycn GUDID data from the provided file URL
 *     tags:
 *       - Data Sync
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *             fileUrl:
 *              type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 */
dataRouter.post('/sync-gudid', controller.syncGUDID)

/**
 * @swagger
 * /api/data/search-gudid:
 *   post:
 *     summary: Search devices in GUDID
 *     description:
 *     tags:
 *       - Data Sync
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *             keywords:
 *              type: string
 *     responses:
 *       201:
 *         description: OK
 *       400:
 *         description: Invalid request body
 */
dataRouter.post('/search-gudid', controller.searchGUDIDDevicesByKeywords)

/**
 * @swagger
 * /api/data/sync-fda-recall:
 *   post:
 *     summary: Sync FDA Recall data
 *     description: Sycn FDA Recall data from the provided file URL
 *     tags:
 *       - Data Sync
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *             fileUrl:
 *              type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 */
dataRouter.post('/sync-fda-recall', controller.syncFDARecall)

/**
 * @swagger
 * /api/data/search-fda-recall:
 *   post:
 *     summary: Search FDA Recall
 *     description:
 *     tags:
 *       - Data Sync
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: string
 *     responses:
 *       201:
 *         description: OK
 *       400:
 *         description: Invalid request body
 */
dataRouter.post('/search-fda-recall', controller.searchFDARecallByKeywords)
