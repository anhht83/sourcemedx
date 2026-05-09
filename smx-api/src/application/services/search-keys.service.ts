import { SearchKey } from '../entities/search-key.entity'
import { User } from '../entities/user.entity'
import { searchKeyRepository } from '../repositories/searchKey.repository'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../../configs/config'
import { AppError } from '../../utils/AppError'
import Stripe from 'stripe'
import { SearchKeyStatus } from '../enums/searchKey.enum'
import { MoreThanOrEqual } from 'typeorm'

export class SearchKeysService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2025-06-30.basil' as any,
    })
  }

  async getKeysByUser(userId: string) {
    return searchKeyRepository.findByUserId(userId)
  }

  async cancelKey(keyId: string) {
    const key = await searchKeyRepository.findById(keyId)
    if (!key) throw new Error('Search key not found')
    if (key.status !== SearchKeyStatus.AVAILABLE)
      throw new Error('Only available keys can be cancelled')
    key.status = SearchKeyStatus.CANCELLED
    await searchKeyRepository.save(key)
  }

  async getPurchasePaymentDetails(stripePaymentId: string) {
    try {
      // Expand latest_charge to get the charge ID
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(stripePaymentId)
      const paymentStatus = paymentIntent.status
      const paymentAmount = paymentIntent.amount_received / 100
      const paymentCurrency = paymentIntent.currency
      const paymentCreated = paymentIntent.created

      let paymentReceiptUrl = null
      const latestChargeId = paymentIntent.latest_charge as string | null
      if (latestChargeId) {
        const charge = await this.stripe.charges.retrieve(latestChargeId)
        paymentReceiptUrl = charge.receipt_url
      }
      return {
        paymentStatus,
        paymentAmount,
        paymentCurrency,
        paymentReceiptUrl,
        paymentCreated,
      }
    } catch (err) {
      return {
        paymentStatus: null,
        paymentAmount: null,
        paymentCurrency: null,
        paymentReceiptUrl: null,
        paymentCreated: null,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }

  async getAvailableKeyByUserId(userId: string) {
    return searchKeyRepository.findOne({
      where: {
        user: { id: userId },
        status: SearchKeyStatus.AVAILABLE,
        expiresAt: MoreThanOrEqual(new Date()),
      },
    })
  }

  async useKey(keyId: string) {
    const key = await searchKeyRepository.findById(keyId)
    if (!key) throw new Error('Search key not found')
    if (key.status !== SearchKeyStatus.AVAILABLE)
      throw new Error('Only available keys can be cancelled')
    key.status = SearchKeyStatus.USED
    await searchKeyRepository.save(key)
  }

  async createSearchKeys(
    userId: string,
    quantity: number,
  ): Promise<{ sessionId: string }> {
    const basePrice = Number(config.searchKey.basePrice)
    const smallBundle = Number(config.searchKey.smallBundle)
    const smallDiscount = Number(config.searchKey.smallDiscount)
    const largeBundle = Number(config.searchKey.largeBundle)
    const largeDiscount = Number(config.searchKey.largeDiscount)

    let discount = 0
    if (quantity >= largeBundle) {
      discount = largeDiscount
    } else if (quantity >= smallBundle) {
      discount = smallDiscount
    }

    const totalPrice = basePrice * quantity * (1 - discount / 100)

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Search Key Bundle (${quantity} keys)`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: config.stripe.successUrl,
      cancel_url: config.stripe.cancelUrl,
      metadata: {
        userId: userId,
        quantity: quantity.toString(),
        discount: discount.toString(),
      },
    }

    try {
      const session = await this.stripe.checkout.sessions.create(sessionConfig)
      return { sessionId: session.id }
    } catch (error) {
      console.error('Error creating Stripe session:', error)
      throw new AppError('Failed to create Stripe session', 500)
    }
  }

  async rewardRegister(userId: string): Promise<void> {
    const expirationDays = Number(config.searchKey.expirationDays)
    const numberRewardRegister = Number(config.searchKey.rewardRegister)
    const searchKeys = Array(numberRewardRegister)
      .fill(null)
      .map(() => {
        const key = new SearchKey()
        key.key = uuidv4()
        key.user = { id: userId } as User
        key.expiresAt = new Date(
          Date.now() + expirationDays * 24 * 60 * 60 * 1000,
        )
        key.price = 0
        key.discountApplied = 0
        key.stripePaymentId = ''
        key.status = SearchKeyStatus.AVAILABLE
        key.isUsed = false
        return key
      })
    await searchKeyRepository.save(searchKeys)
  }

  async handleStripeWebhook(event: any): Promise<void> {
    console.log('🔍 Stripe webhook received:', event.type)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata || {}
      const userId = metadata.userId
      const quantity = metadata.quantity
      const discount = metadata.discount
      if (!userId || !quantity || !discount) {
        throw new Error('Missing required metadata')
      }
      const basePrice = Number(config.searchKey.basePrice)
      const expirationDays = Number(config.searchKey.expirationDays)
      const actualPrice = basePrice * (1 - parseInt(discount) / 100)
      const searchKeys = Array(parseInt(quantity))
        .fill(null)
        .map(() => {
          const key = new SearchKey()
          key.key = uuidv4()
          key.user = { id: userId } as User
          key.expiresAt = new Date(
            Date.now() + expirationDays * 24 * 60 * 60 * 1000,
          )
          key.price = actualPrice
          key.discountApplied = parseInt(discount)
          key.stripePaymentId = session.payment_intent as string
          key.status = SearchKeyStatus.AVAILABLE
          key.isUsed = false
          return key
        })
      await searchKeyRepository.save(searchKeys)
    } else if (
      event.type === 'checkout.session.expired' ||
      event.type === 'payment_intent.payment_failed'
    ) {
      const session = event.data.object
      const metadata = session.metadata || {}
      const userId = metadata.userId
      if (userId) {
        await searchKeyRepository.update(
          {
            user: { id: userId },
            status: SearchKeyStatus.AVAILABLE,
            stripePaymentId: session.payment_intent as string,
          },
          { status: SearchKeyStatus.CANCELLED },
        )
      }
    }
  }
}
