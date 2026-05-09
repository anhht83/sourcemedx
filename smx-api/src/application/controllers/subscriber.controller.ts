import { Request, Response, NextFunction } from 'express'
import { SubscriberUseCase } from '../usecases/subscriber.usecase'

export class SubscriberController {
  subscriberUseCase: SubscriberUseCase

  constructor() {
    this.subscriberUseCase = new SubscriberUseCase()
  }

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.subscriberUseCase.subscribe(req.body?.email)
      res.json(message)
    } catch (error) {
      next(error)
    }
  }
}
