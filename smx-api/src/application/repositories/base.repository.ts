import {
  Repository,
  EntityTarget,
  DeepPartial,
  ObjectLiteral,
  FindOneOptions,
} from 'typeorm'
import { AppDataSource } from '../../configs/database'
import { validate as isUuid } from 'uuid'

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(model: EntityTarget<T>) {
    super(model, AppDataSource.manager)
  }

  async findOrCreate(
    options: FindOneOptions<T> & { defaults: DeepPartial<T> },
  ): Promise<T> {
    const { defaults, where, ...findOptions } = options

    // Check if 'id' exists and is a valid UUID
    if (!where || !isUuid((where as any).id)) {
      return await this.createAndSave(defaults)
    }

    let entity = await this.findOne({
      where,
      ...findOptions,
    })

    if (!entity) {
      entity = await this.createAndSave(defaults)
    }
    return entity
  }

  async createAndSave(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data)
    return await this.save(entity)
  }
}
