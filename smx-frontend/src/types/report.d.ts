import { EReportType } from '@/enums/report.enum'

export type TExportFormat = 'xlsx' | 'csv' | 'pdf'

export interface IReportProcess {
  progress: number
  isCompleted?: boolean
  isSuccess?: boolean
  isError?: boolean
  message?: string
  links?: any
  reports?: IReport[]
}

export interface IReport {
  id: string
  threadId: string
  fileUrl: string
  fileName?: string
  fileType?: TExportFormat
  reportType: EReportType
  createdAt?: string
  updatedAt?: string
}
