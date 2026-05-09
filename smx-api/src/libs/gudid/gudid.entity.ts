import { Entity, PrimaryColumn, Column } from 'typeorm'
import {
  ICustomerContact,
  IDevice,
  IDeviceSize,
  IGmdn,
  IIdentifier,
  IPremarketSubmission,
  IProductCode,
  ISterilization,
} from './gudid.interface'
import { EDeviceRecordStatus, EPublicVersionStatus } from './gudid.enum'

@Entity('gudid_devices')
export class GUDIDDevice implements IDevice {
  @PrimaryColumn({ name: 'public_device_record_key' })
  publicDeviceRecordKey: string

  @Column({ nullable: true, name: 'primary_di_number' })
  primaryDiNumber: string

  @Column({ nullable: true })
  gtin?: string

  @Column({ nullable: true, name: 'public_version_status' })
  publicVersionStatus?: EPublicVersionStatus

  @Column({ type: 'int', nullable: true, name: 'public_version_number' })
  publicVersionNumber?: number

  @Column({ type: 'date', nullable: true, name: 'public_version_date' })
  publicVersionDate?: string

  @Column({ nullable: true, name: 'device_record_status' })
  deviceRecordStatus?: EDeviceRecordStatus | string

  @Column({ nullable: true, name: 'brand_name' })
  brandName?: string

  @Column({ nullable: true, name: 'company_name' })
  companyName?: string

  @Column({ nullable: true, name: 'duns_number' })
  dunsNumber?: string

  @Column({ type: 'text', nullable: true, name: 'device_description' })
  deviceDescription?: string

  @Column({ type: 'jsonb', nullable: true })
  identifiers?: IIdentifier[]

  @Column({ type: 'jsonb', nullable: true, name: 'gmdn_terms' })
  gmdnTerms?: IGmdn[]

  @Column({ type: 'jsonb', nullable: true, name: 'product_codes' })
  productCodes?: IProductCode[]

  @Column({ type: 'jsonb', nullable: true, name: 'device_sizes' })
  deviceSizes?: IDeviceSize[]

  @Column({ type: 'jsonb', nullable: true, name: 'contacts' })
  contacts?: ICustomerContact[]

  @Column({ type: 'jsonb', nullable: true, name: 'environmental_conditions' })
  environmentalConditions?: any

  @Column({ type: 'jsonb', nullable: true, name: 'sterilization' })
  sterilization?: ISterilization

  @Column({ type: 'jsonb', nullable: true, name: 'premarket_submissions' })
  premarketSubmissions?: IPremarketSubmission[]
}
