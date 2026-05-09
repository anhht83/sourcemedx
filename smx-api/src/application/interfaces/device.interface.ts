import { Device } from '../entities'

export interface TDevice extends Omit<Device, 'id'> {
  sourceData?: any
}
