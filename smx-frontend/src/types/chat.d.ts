import {
  EAiSearchRequestStatus,
  ESearchStatus,
  ESender,
} from '@/enums/chat.enum'
import { IReport } from '@/types/report'

export interface IThread {
  id: string
  title: string
  searchStatus: ESearchStatus
  messages?: IMessage[]
  reports?: IReport[]
  createdAt?: string
  updatedAt?: string
}

export interface ISearchRequestContext {
  product: string
  suppliers: string[]
  certifications: string[]
  specifications: string[]
  supplierCapacity: number
  supplierCapacityUnit: string
  supplierCapacityPeriodicity: string
  marketRegion: string
}

export interface IMessageRequest {
  threadId?: string
  message: string
}

export interface IMessage {
  id?: string
  threadId: string
  sender: ESender
  message: string
  searchStatus?: EAiSearchRequestStatus
  context?: ISearchRequestContext
  createdAt?: string
  updatedAt?: string
  threadSearchStatus?: ESearchStatus
}
