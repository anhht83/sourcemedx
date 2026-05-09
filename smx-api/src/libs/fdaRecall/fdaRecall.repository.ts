import { BaseRepository } from '../../application/repositories/base.repository'
import { FDARecall } from './fdaRecall.entity'
import { IFDARecall } from './fdaRecall.interface'
import { cleanTextForTsvector } from '../../utils/cleanTextForTsvector'

function buildSearchText(recall: IFDARecall): string {
  const productDescription = cleanTextForTsvector(
    recall.productDescription?.trim() || '',
  )
  const deviceName = cleanTextForTsvector(
    recall.openfda?.deviceName?.trim() || '',
  )

  return [productDescription, deviceName].filter(Boolean).join('. ').trim()
}

export class FDARecallRepository extends BaseRepository<FDARecall> {
  constructor() {
    super(FDARecall)
  }

  async upsertRecall(recall: IFDARecall): Promise<void> {
    const searchText = buildSearchText(recall)
    const fdaRecallEntity = this.create({
      ...recall,
      searchText,
    })
    await this.save(fdaRecallEntity)
  }

  async upsertRecalls(recalls: IFDARecall[]): Promise<void> {
    if (!recalls.length) return

    // Create and persist FDA Recall entities with search text
    const entities = recalls.map((recall) => {
      const searchText = buildSearchText(recall)
      return this.create({
        ...recall,
        searchText,
      })
    })
    await this.save(entities)
  }

  async truncateAll(): Promise<void> {
    console.log('Truncating all FDA Recall data...')
    await this.clear()
    console.log('FDA Recall data truncated successfully')
  }

  async getByCfresId(cfresId: string) {
    return await this.findOneBy({
      cfresId,
    })
  }

  async getByRecallingFirm(recallingFirm: string) {
    return await this.findBy({
      recallingFirm,
    })
  }

  async getByRecallStatus(recallStatus: string) {
    return await this.findBy({
      recallStatus,
    })
  }

  async getByDateRange(startDate: string, endDate: string) {
    return await this.createQueryBuilder('recall')
      .where('recall.eventDateInitiated >= :startDate', { startDate })
      .andWhere('recall.eventDateInitiated <= :endDate', { endDate })
      .getMany()
  }

  async searchByKeywords(keywords: string[]) {
    const filteredKeywords = keywords.filter(Boolean)
    if (filteredKeywords.length === 0) return []

    const weightedQueries = filteredKeywords
      .map((keyword, index) => {
        const cleanedKeyword = cleanTextForTsvector(keyword).trim()
        if (!cleanedKeyword) return null

        const tsquery = cleanedKeyword
          .split(/\s+/)
          .map((term) => `${term}:*`)
          .join(' & ')

        let weight: number
        if (index < 2) {
          weight = 1.0
        } else if (index < 3) {
          weight = 0.4
        } else {
          weight = 0.05
        }

        return { tsquery, weight }
      })
      .filter(Boolean)

    const rankExpression = weightedQueries
      .map(
        (q, i) =>
          `${q!.weight.toFixed(2)} * ts_rank(recall.searchVector, to_tsquery('english', :query${i}))`,
      )
      .join(' + ')

    const queryBuilder = this.createQueryBuilder('recall').addSelect(
      'recall.searchVector',
    )

    // Must match at least 2 of the first 3 queries
    const requiredConditions = []

    if (weightedQueries.length >= 3) {
      requiredConditions.push(
        `(
      (recall.searchVector @@ to_tsquery('english', :query0)::int +
       recall.searchVector @@ to_tsquery('english', :query1)::int +
       recall.searchVector @@ to_tsquery('english', :query2)::int
      ) >= 2
    )`,
      )
    } else if (weightedQueries.length === 2) {
      requiredConditions.push(
        `(recall.searchVector @@ to_tsquery('english', :query0) AND recall.searchVector @@ to_tsquery('english', :query1))`,
      )
    } else if (weightedQueries.length === 1) {
      requiredConditions.push(
        `recall.searchVector @@ to_tsquery('english', :query0)`,
      )
    }

    // Optional conditions (beyond first 3)
    if (weightedQueries.length > 3) {
      const optionalConditions = weightedQueries
        .slice(3)
        .map(
          (_, i) =>
            `recall.searchVector @@ to_tsquery('english', :query${i + 3})`,
        )
        .join(' OR ')

      if (optionalConditions) {
        requiredConditions.push(`(${optionalConditions})`)
      }
    }

    queryBuilder.where(requiredConditions.join(' AND '))

    weightedQueries.forEach((q, i) => {
      queryBuilder.setParameter(`query${i}`, q!.tsquery)
    })

    queryBuilder
      .addSelect(`(${rankExpression})`, 'rank')
      .orderBy('rank', 'DESC')
      .limit(5000)

    const recalls = await queryBuilder.getRawAndEntities()

    const result: (FDARecall & { rank: number })[] = []
    for (const i in recalls.entities) {
      result.push({
        ...recalls.entities[i],
        rank: parseFloat(recalls.raw[i]['rank']),
      })
    }

    return result
  }

  async search(query: string, limit: number = 50, offset: number = 0) {
    return await this.createQueryBuilder('recall')
      .addSelect('recall.searchVector')
      .where('recall.searchVector @@ plainto_tsquery(:query)', { query })
      .orderBy('ts_rank(recall.searchVector, plainto_tsquery(:query))', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany()
  }

  async searchWithFilters(
    query: string,
    filters: {
      recallStatus?: string
      recallingFirm?: string
      startDate?: string
      endDate?: string
    },
    limit: number = 50,
    offset: number = 0,
  ) {
    const queryBuilder = this.createQueryBuilder('recall')
      .addSelect('recall.searchVector')
      .where('recall.searchVector @@ plainto_tsquery(:query)', { query })

    if (filters.recallStatus) {
      queryBuilder.andWhere('recall.recallStatus = :recallStatus', {
        recallStatus: filters.recallStatus,
      })
    }

    if (filters.recallingFirm) {
      queryBuilder.andWhere('recall.recallingFirm ILIKE :recallingFirm', {
        recallingFirm: `%${filters.recallingFirm}%`,
      })
    }

    if (filters.startDate) {
      queryBuilder.andWhere('recall.eventDateInitiated >= :startDate', {
        startDate: filters.startDate,
      })
    }

    if (filters.endDate) {
      queryBuilder.andWhere('recall.eventDateInitiated <= :endDate', {
        endDate: filters.endDate,
      })
    }

    return await queryBuilder
      .orderBy('ts_rank(recall.searchVector, plainto_tsquery(:query))', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany()
  }
}

export const fdaRecallRepository = new FDARecallRepository()
