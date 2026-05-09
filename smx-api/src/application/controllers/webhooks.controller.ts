import { Request, Response, NextFunction } from 'express'
import { SearchKeyUseCase } from '../usecases/searchkey.usecase'
import { config } from '../../configs/config'
import Stripe from 'stripe'

export class WebhooksController {
  searchKeyUseCase: SearchKeyUseCase
  stripe: Stripe
  constructor() {
    this.searchKeyUseCase = new SearchKeyUseCase()
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2025-06-30.basil' as any,
    })
  }

  async handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = config.stripe.webhookSecret
    const rawBody = (req as any).rawBody
    try {
      if (!rawBody || !signature || !webhookSecret) {
        return res
          .status(400)
          .json({ error: 'Missing required Stripe webhook data' })
      }
      // If using raw body, you may need to access req.rawBody
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      )
      await this.searchKeyUseCase.handleStripeWebhook(event)
      res.json({ received: true })
    } catch (error) {
      next(error)
    }
  }
}
