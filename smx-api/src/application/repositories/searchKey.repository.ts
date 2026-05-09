import { BaseRepository } from './base.repository'
import { SearchKey } from '../entities/search-key.entity'
import { UpdateResult } from 'typeorm'

export class SearchKeyRepository extends BaseRepository<SearchKey> {
  constructor() {
    super(SearchKey)
  }

  async findByUserId(userId: string): Promise<SearchKey[]> {
    return this.find({ where: { user: { id: userId } } })
  }

  async findById(id: string): Promise<SearchKey | null> {
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
    partialEntity: Partial<SearchKey>,
  ): Promise<UpdateResult> {
    return super.update(criteria, partialEntity)
  }
}

export const searchKeyRepository = new SearchKeyRepository()
