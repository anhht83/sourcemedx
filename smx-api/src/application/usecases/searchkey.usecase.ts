import { SearchKeysService } from '../services/search-keys.service'
import Stripe from 'stripe'

export class SearchKeyUseCase {
  searchKeysService: SearchKeysService

  constructor() {
    this.searchKeysService = new SearchKeysService()
  }

  getKeysByUser = async (userId: string) => {
    return this.searchKeysService.getKeysByUser(userId)
  }

  cancelKey = async (keyId: string) => {
    return this.searchKeysService.cancelKey(keyId)
  }

  getPurchasePaymentDetails = async (stripePaymentId: string) => {
    return this.searchKeysService.getPurchasePaymentDetails(stripePaymentId)
  }

  createSearchKey = async (userId: string, quantity: number) => {
    return this.searchKeysService.createSearchKeys(userId, quantity)
  }

  handleStripeWebhook = async (event: Stripe.Event) => {
    return this.searchKeysService.handleStripeWebhook(event)
  }
}
