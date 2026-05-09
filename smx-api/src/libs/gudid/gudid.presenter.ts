import { GUDIDDevice } from './gudid.entity'
import { IExportedDevice } from '../xfile/xfile.interface'
import { EDeviceRecordStatus } from './gudid.enum'

export class GUDIDPresenter {
  static deviceToExport(device: GUDIDDevice): IExportedDevice {
    return {
      ...device,
      productName: device.brandName || '',
      productDescription: device.deviceDescription || '',
      companyName: device.companyName || '',
      contactEmail: device.contacts?.[0]?.email || '',
      contactPhone: device.contacts?.[0]?.phone || '',
      website: `https://accessgudid.nlm.nih.gov/devices/${device.primaryDiNumber}`,
      fdaReport: {
        url: `https://fda.report/GUDID/${device.primaryDiNumber}`,
        approved: device.deviceRecordStatus === EDeviceRecordStatus.Published,
      },
    }
  }
}
