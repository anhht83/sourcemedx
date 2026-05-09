import { IExportedFDARecall } from '../fdaRecall'
import { TExportFormat } from './xfile.enum'
import { Worksheet, Workbook } from 'exceljs'

export interface IExportedDevice {
  productName?: string
  productDescription?: string
  companyName?: string
  contactEmail?: string
  contactPhone?: string | number
  website?: string
  fdaReport?: {
    url?: string
    approved?: boolean
  }

  [key: string]: any
}

export interface IExportOptionsOptions {
  cleanedData?: (data: any) => any
}

export interface IExportOptions {
  fileName: string
  format: TExportFormat | TExportFormat[]
  template?: {
    path: string
    worksheet?: string
  }
  writeData: (
    worksheet: Worksheet | Workbook,
    options?: IExportOptionsOptions,
  ) => void
}

export interface IExportedFile {
  fileName: string
  fileUrl: string
  fileType: TExportFormat | TExportFormat[]
}

export interface IExportReportOptions {
  fileName: string
  format: TExportFormat | TExportFormat[]
  devices: IExportedDevice[]
  fdaRecalls?: IExportedFDARecall[]
}
