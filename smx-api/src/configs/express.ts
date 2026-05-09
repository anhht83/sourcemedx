import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { router } from '../application/routes'
import { logger } from '../application/middlewares/logger'
import { stripeRawBodyMiddleware } from '../application/middlewares/stripeRawBody'
import { config } from './config'
import { errorHandler } from '../application/middlewares/errorHandler'
import passport from './passport'
import cookieParser from 'cookie-parser'
import { setupSwagger } from './swagger'
import { createServer } from 'http'
import { setupSocket } from './socket'
import './redis'
import { initQueueWorkers } from '../application/queue/workers'
import path from 'path'
import { WebhooksController } from '../application/controllers/webhooks.controller'

const corsOptions = {
  /*
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) return callback(null, true) // Allow requests with no origin (like mobile apps or Postman)
    return callback(null, true) // Allow all domains dynamically
  },

   */
  origin: true,
  credentials: true, // Allow sending cookies and authentication headers
}

const webhooksController = new WebhooksController()

const app = express()

// Create HTTP server
const server = createServer(app)

// Setup Socket.io
const io = setupSocket(server)

// Setup queue worker
initQueueWorkers(io)

app.use(cors(corsOptions))
app.use(cookieParser())

// Apply raw body middleware to webhook route BEFORE JSON parsing
app.use(
  '/api/webhooks/stripe',
  stripeRawBodyMiddleware,
  async (req, res, next) => {
    try {
      await webhooksController.handleStripeWebhook(req, res, next)
    } catch (error) {
      console.error('❌ Webhook error:', error)
      next(error)
    }
  },
)

app.use(express.json()) // Parse JSON requests for other routes

app.use(helmet()) // Secure HTTP headers
app.use(morgan('dev')) // Log requests
app.use(passport.initialize()) // Initialize Passport

app.use(logger)

// Routes
app.use('/api', router)
if (config.nodeEnv !== 'production') {
  setupSwagger(app)
}
// Default route
app.get('/', (req: Request, res: Response) => {
  res.send(`Running in ${config.nodeEnv} mode on port ${config.port}`)
})
// Serve static files from /public
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')))
app.use(errorHandler)

export default server
