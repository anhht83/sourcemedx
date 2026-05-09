import {
  ERecallStatus,
  EDeviceClass,
  EMedicalSpecialty,
} from './fdaRecall.enum'

export interface IFDARecall {
  id?: string
  cfresId?: string
  productResNumber?: string
  eventDateInitiated?: string
  eventDatePosted?: string
  recallStatus?: ERecallStatus | string
  resEventNumber?: string
  productCode?: string
  kNumbers?: string[]
  productDescription: string
  codeInfo?: string
  recallingFirm: string
  address1?: string
  city?: string
  reasonForRecall?: string
  rootCauseDescription?: string
  action?: string
  productQuantity?: string
  distributionPattern?: string
  openfda?: IOpenFDA
  searchText?: string
}

export interface IOpenFDA {
  kNumber?: string[]
  registrationNumber?: string[]
  feiNumber?: string[]
  deviceName?: string
  medicalSpecialtyDescription?: EMedicalSpecialty | string
  regulationNumber?: string
  deviceClass?: EDeviceClass | string
}

export interface IFDARecallMeta {
  disclaimer: string
  terms: string
  license: string
  lastUpdated: string
  results: {
    skip: number
    limit: number
    total: number
  }
}

export interface IFDARecallResponse {
  meta: IFDARecallMeta
  results: IFDARecallRaw[]
}

// Raw JSON data structure (snake_case)
export interface IFDARecallRaw {
  cfres_id: string
  product_res_number: string
  event_date_initiated: string
  event_date_posted: string
  recall_status: string
  res_event_number: string
  product_code: string
  k_numbers?: string[]
  product_description: string
  code_info?: string
  recalling_firm: string
  address_1?: string
  city?: string
  reason_for_recall: string
  root_cause_description?: string
  action: string
  product_quantity: string
  distribution_pattern?: string
  openfda?: IOpenFDARaw
}

export interface IOpenFDARaw {
  k_number?: string[]
  registration_number?: string[]
  fei_number?: string[]
  device_name?: string
  medical_specialty_description?: string
  regulation_number?: string
  device_class?: string
}

export interface IExportedFDARecall {
  cfresId: string
  productResNumber: string
  eventDateInitiated: string
  eventDatePosted: string
  recallStatus: string
  resEventNumber: string
  productCode: string
  kNumbers?: string[]
  productDescription: string
  codeInfo?: string
  recallingFirm: string
  address1?: string
  city?: string
  reasonForRecall: string
  rootCauseDescription?: string
  action: string
  productQuantity: string
  distributionPattern?: string
  deviceName?: string
  medicalSpecialty?: string
  regulationNumber?: string
  deviceClass?: string
  contactEmail: string
  contactPhone: string
  website: string
  fdaReport: {
    url: string
    approved: boolean
  }
  [key: string]: any
}
