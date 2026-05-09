import { Request, Response, NextFunction } from 'express'
import { SearchKeyUseCase } from '../usecases/searchkey.usecase'
import { AppError } from '../../utils/AppError'

export class SearchKeysController {
  searchKeyUseCase: SearchKeyUseCase
  constructor() {
    this.searchKeyUseCase = new SearchKeyUseCase()
  }

  async getKeysByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      if (!user) {
        throw new AppError('User not found')
      }
      const keys = await this.searchKeyUseCase.getKeysByUser(user.id)
      res.json(keys)
    } catch (error) {
      next(error)
    }
  }

  async cancelKey(req: Request, res: Response, next: NextFunction) {
    try {
      const keyId = req.params.keyId
      await this.searchKeyUseCase.cancelKey(keyId)
      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  }

  async getPurchasePaymentDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const stripePaymentId = req.params.stripePaymentId
      const paymentDetails =
        await this.searchKeyUseCase.getPurchasePaymentDetails(stripePaymentId)
      res.json(paymentDetails)
    } catch (error) {
      next(error)
    }
  }

  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      if (!user) {
        throw new AppError('User not found')
      }
      const session = await this.searchKeyUseCase.createSearchKey(
        user.id,
        req.body.count,
      )
      res.json(session)
    } catch (error) {
      next(error)
    }
  }
}
