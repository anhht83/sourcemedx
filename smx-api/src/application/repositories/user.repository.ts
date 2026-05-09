import { UpdateResult } from 'typeorm'
import { User } from '../entities'
import { BaseRepository } from './base.repository'

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email })
  }

  async findById(id: string): Promise<User | null> {
    return this.findOneBy({ id })
  }

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | Record<string, any>,
    partialEntity: Partial<User>,
  ): Promise<UpdateResult> {
    return super.update(criteria, partialEntity)
  }
}

export const userRepository = new UserRepository()
