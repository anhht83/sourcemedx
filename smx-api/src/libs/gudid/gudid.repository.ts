import { BaseRepository } from '../../application/repositories/base.repository'
import { GUDIDDevice } from './gudid.entity'
import { IDevice } from './gudid.interface'
import { deviceRepository } from '../../application/repositories/device.repository'
import { ESource } from '../../application/enums/source.enum'

export class GUDIDRepository extends BaseRepository<GUDIDDevice> {
  constructor() {
    super(GUDIDDevice)
  }

  async upsertDevice(device: IDevice): Promise<void> {
    const gudidEntity = this.create(device)
    await this.save(gudidEntity)
    await deviceRepository.upsertDevice({
      name: device.brandName || '',
      description: device.deviceDescription || '',
      terms: device.gmdnTerms?.map((item) => {
        return {
          name: item.gmdnPTName || '',
          description: item.gmdnPTDefinition || '',
        }
      }),
      source: ESource.gudid,
      sourceId: gudidEntity.publicDeviceRecordKey,
    })
  }

  async upsertDevices(devices: IDevice[]): Promise<void> {
    if (!devices.length) return

    // 1. Create and persist GUDID entities
    const gudidEntities = await this.save(
      devices.map((device) => this.create(device)),
    )

    // 2. Prepare structured device upserts
    const deviceUpserts = gudidEntities.map(
      ({ brandName, deviceDescription, gmdnTerms, publicDeviceRecordKey }) => ({
        name: brandName ?? '',
        description: deviceDescription ?? '',
        terms: Array.isArray(gmdnTerms)
          ? gmdnTerms.map(({ gmdnPTName, gmdnPTDefinition }) => ({
              name: gmdnPTName ?? '',
              description: gmdnPTDefinition ?? '',
            }))
          : [],
        source: ESource.gudid,
        sourceId: publicDeviceRecordKey,
      }),
    )

    // 3. Bulk upsert
    await deviceRepository.upsertDevices(deviceUpserts)
  }
}

export const gudidRepository = new GUDIDRepository()
