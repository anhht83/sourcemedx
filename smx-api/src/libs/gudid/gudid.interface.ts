import {
  EDeviceIdIssuingAgency,
  EDeviceIdType,
  EDeviceRecordStatus,
  EGmdnCodeStatus,
  EMRISafetyStatus,
  EPkgStatus,
  EPublicVersionStatus,
  ESterilizationMethod,
} from './gudid.enum'

export interface IDevice {
  id?: string
  gtin?: string // GS1 UID map, deviceId under <identifiers> with deviceIdIssuingAgency = 'GS1'
  primaryDiNumber?: string
  publicDeviceRecordKey: string
  publicVersionStatus?: EPublicVersionStatus
  publicVersionNumber?: number
  publicVersionDate?: string
  deviceRecordStatus?: EDeviceRecordStatus | string
  brandName?: string
  catalogNumber?: string
  companyName?: string
  dunsNumber?: string
  deviceDescription?: string
  MRISafetyStatus?: EMRISafetyStatus
  deviceSizes?: IDeviceSize[]
  identifiers?: IIdentifier[]
  contacts?: ICustomerContact[]
  gmdnTerms?: IGmdn[]
  productCodes?: IProductCode[]
  environmentalConditions?: any
  sterilization?: ISterilization
  premarketSubmissions?: IPremarketSubmission[]
  searchText?: string
}

export interface IIdentifier {
  deviceId?: string
  deviceIdType?: EDeviceIdType
  deviceIdIssuingAgency?: EDeviceIdIssuingAgency
  containsDINumber?: string
  pkgQuantity?: string
  pkgDiscontinueDate?: string
  pkgStatus?: EPkgStatus
  pkgType?: string
}

export interface ICustomerContact {
  phone?: number
  phoneExtension?: string
  email?: string
}

export interface IProductCode {
  productCode?: string
  productCodeName?: string
}

export interface IGmdn {
  gmdnCode?: string
  gmdnPTName?: string
  gmdnPTDefinition?: string
  implantable?: string
  gmdnCodeStatus?: EGmdnCodeStatus
}

export interface IDeviceSize {
  sizeType?: string
  sizeText?: string
}

export interface IStorageHandling {
  storageHandlingType?: string
  storageHandlingSpecialConditionText?: string
}

export interface IMethodType {
  sterilizationMethod?: ESterilizationMethod
  sterilizationPriorToUse?: string
}

export interface ISterilization {
  deviceSterile?: boolean
  sterilizationPriorToUse?: boolean
  methodTypes?: IMethodType[]
}

export interface IPremarketSubmission {
  submissionNumber?: string
  supplementNumber?: string
}
