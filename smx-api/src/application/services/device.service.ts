import { ISearchRequestContext } from '../interfaces/chat.interface'
import { cleanTextForTsvector } from '../../utils/cleanTextForTsvector'
import { deviceRepository } from '../repositories/device.repository'
import { ESource } from '../enums/source.enum'
import { Device } from '../entities'
import { GUDIDService } from '../../libs/gudid/gudid.service'

export class DeviceService {
  gudidService: GUDIDService

  constructor() {
    this.gudidService = new GUDIDService()
  }

  async resolveSourceRecord(source?: string, sourceId?: string): Promise<any> {
    if (!sourceId) return null
    switch (source) {
      case ESource.gudid:
        return await this.gudidService.getByPublicDeviceRecordKey(sourceId)
      default:
        return null
    }
  }

  async searchByKeywords(contextSearch: ISearchRequestContext) {
    const specifications = (contextSearch.specifications || []).filter(Boolean)
    if (specifications.length === 0) return []

    const weightedQueries = specifications
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
          `${q!.weight.toFixed(2)} * ts_rank(device.search_vector, to_tsquery('english', :query${i}))`,
      )
      .join(' + ')

    const queryBuilder = deviceRepository.createQueryBuilder('device')

    // Must match at least 2 of the first 3 queries
    const requiredConditions = []

    if (weightedQueries.length >= 3) {
      requiredConditions.push(
        `(
      (device.search_vector @@ to_tsquery('english', :query0)::int +
       device.search_vector @@ to_tsquery('english', :query1)::int +
       device.search_vector @@ to_tsquery('english', :query2)::int
      ) >= 2
    )`,
      )
    } else if (weightedQueries.length === 2) {
      requiredConditions.push(
        `(device.search_vector @@ to_tsquery('english', :query0) AND device.search_vector @@ to_tsquery('english', :query1))`,
      )
    } else if (weightedQueries.length === 1) {
      requiredConditions.push(
        `device.search_vector @@ to_tsquery('english', :query0)`,
      )
    }

    // Optional conditions (beyond first 3)
    if (weightedQueries.length > 3) {
      const optionalConditions = weightedQueries
        .slice(3)
        .map(
          (_, i) =>
            `device.search_vector @@ to_tsquery('english', :query${i + 3})`,
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

    const devices = await queryBuilder.getRawAndEntities()

    const result: (Device & { rank: number; sourceData: any })[] = []
    for (const i in devices.entities) {
      const sourceData = await this.resolveSourceRecord(
        devices.entities[i].source,
        devices.entities[i].sourceId,
      )
      result.push({
        ...devices.entities[i],
        rank: parseFloat(devices.raw[i]['rank']),
        sourceData,
      })
    }

    return result
  }
}
