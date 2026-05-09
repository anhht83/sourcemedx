import { IExportedDevice } from '../../libs/xfile/xfile.interface'
import { TDevice } from '../interfaces/device.interface'

export class DevicePresenter {
  static devicesToExport(devices: TDevice[]): IExportedDevice[] {
    return devices.map((device) => {
      return {
        ...device,
        productName: device.name || '',
        productDescription: device.description || '',
        companyName: device.sourceData?.companyName || '',
        contactEmail: device.sourceData?.contactEmail || '',
        contactPhone: device.sourceData?.contactPhone || '',
        website: device.sourceData?.website || '',
        fdaReport: device.sourceData?.fdaReport,
      }
    })
  }
}
