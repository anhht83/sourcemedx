import { ISearchRequestContext } from '../interfaces/chat.interface'
import { DeviceService } from '../services/device.service'
import { DevicePresenter } from '../presenters/device.presenter'
import { ESource } from '../enums/source.enum'
import { GUDIDPresenter } from '../../libs/gudid/gudid.presenter'

export class DeviceUseCase {
  deviceService: DeviceService

  constructor() {
    this.deviceService = new DeviceService()
  }

  presenterSourceRecord(source: string, sourceData: any) {
    switch (source) {
      case ESource.gudid:
        return GUDIDPresenter.deviceToExport(sourceData)
      default:
        return null
    }
  }

  async searchByKeywords(contextSearch: ISearchRequestContext) {
    const devices = await this.deviceService.searchByKeywords(contextSearch)
    return DevicePresenter.devicesToExport(
      devices.map((device) => {
        return {
          ...device,
          sourceData: this.presenterSourceRecord(
            device.source || '',
            device.sourceData,
          ),
        }
      }),
    )
  }
}
