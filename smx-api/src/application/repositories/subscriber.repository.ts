import { Subscriber } from '../entities'
import { BaseRepository } from './base.repository'

export class SubscriberRepository extends BaseRepository<Subscriber> {
  constructor() {
    super(Subscriber)
  }
}

export const subscriberRepository = new SubscriberRepository()
