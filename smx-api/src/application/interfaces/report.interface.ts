import { Report } from '../entities'

export interface IReportProcess {
  progress: number
  isSuccess?: boolean
  isError?: boolean
  isCompleted?: boolean
  message?: string
  links?: any
  reports?: Report[]
}
