// import pgvector from 'pgvector'
import { BaseRepository } from './base.repository'
import { buildTextForEmbedding } from '../../utils/buildTextForEmbedding'
import { Device } from '../entities'
import { TDevice } from '../interfaces/device.interface'

// import { generateEmbedding } from '../ai/generateEmbedding'

export class DeviceRepository extends BaseRepository<Device> {
  constructor() {
    super(Device)
  }

  async upsertDevice(device: TDevice): Promise<void> {
    const searchText = buildTextForEmbedding(device)
    //const embedding = searchText ? await generateEmbedding(searchText) : null

    await this.upsert(
      {
        ...device,
        searchText,
      },
      ['source', 'sourceId'],
    )
  }

  async upsertDevices(devices: TDevice[]): Promise<void> {
    const enriched = devices.map((device) => {
      const searchText = buildTextForEmbedding(device)
      //const embedding = searchText ? await generateEmbedding(searchText) : null
      return {
        ...device,
        searchText,
      }
    })

    await this.upsert(enriched, ['source', 'sourceId'])
  }
}

export const deviceRepository = new DeviceRepository()
