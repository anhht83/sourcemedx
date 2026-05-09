import { EAiSearchRequestStatus } from '../enums/chat.enum'

export interface IAiResponse {
  message?: string
  searchStatus?: EAiSearchRequestStatus
  context?: ISearchRequestContext
}

export interface ISearchRequestContext {
  certifications?: string[]
  specifications?: string[]
  marketRegions?: string[]
}
