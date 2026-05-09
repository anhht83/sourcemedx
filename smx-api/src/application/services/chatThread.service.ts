import { ChatThread } from '../entities'
import { ISearchRequestContext } from '../interfaces/chat.interface'
import { chatThreadRepository } from '../repositories/chatThread.repository'
import { AppError } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'
import { truncateString } from '../../utils/truncateString'
import { EAiSearchRequestStatus, ESearchStatus } from '../enums/chat.enum'
import { reportQueue } from '../queue/reportQueue'
import { generateTitleFromContext } from '../../utils/generateTitleFromContext'
import { SearchKeysService } from './search-keys.service'

export class ChatThreadService {
  searchKeysService: SearchKeysService

  constructor() {
    this.searchKeysService = new SearchKeysService()
  }

  getTheadSearchStatusFromSearchStatusContext = (
    searchStatusContext: EAiSearchRequestStatus,
  ): ESearchStatus => {
    switch (searchStatusContext) {
      case EAiSearchRequestStatus.ready_for_search:
        return ESearchStatus.searching
      case EAiSearchRequestStatus.awaiting_confirmation:
        return ESearchStatus.awaiting_confirmation
      case EAiSearchRequestStatus.not_a_search_request:
        return ESearchStatus.not_ready
      case EAiSearchRequestStatus.cancelled:
        return ESearchStatus.cancelled
      case EAiSearchRequestStatus.incomplete_details:
        return ESearchStatus.incomplete_details
      default:
        return searchStatusContext
    }
  }

  findOrCreate = async (
    threadId: string = '',
    userId: string,
    title: string = '',
  ) => {
    /*
    let searchKey: SearchKey | null = null
    if (!threadId) {
      searchKey = await this.searchKeysService.getAvailableKeyByUserId(userId)
      if (!searchKey) {
        throw new AppError(
          'The number of reports has been exceeded. Please purchase more reports.',
          StatusCodes.FORBIDDEN,
        )
      }
    }
    */
    const chatThread = await chatThreadRepository.findOrCreate({
      where: { id: threadId, userId },
      defaults: {
        userId,
        title: truncateString(title),
        searchStatus: ESearchStatus.not_ready,
      },
    })
    if (!chatThread) {
      throw new AppError('Chat thread not found.', StatusCodes.NOT_FOUND)
    }
    /*
    if (searchKey) {
      await this.searchKeysService.useKey(searchKey.id)
    }*/
    return chatThread
  }

  update = async (
    thread: ChatThread,
    {
      searchStatus,
      context,
    }: {
      searchStatus?: any
      context?: ISearchRequestContext
    },
  ): Promise<ChatThread> => {
    // update context
    if (context) {
      thread.context = { ...thread.context, ...context }
      const newTitle = generateTitleFromContext(thread.context)
      if (newTitle) thread.title = newTitle
    }
    // update search status
    if (searchStatus)
      thread.searchStatus =
        this.getTheadSearchStatusFromSearchStatusContext(searchStatus)
    // save thread
    thread.updatedAt = new Date()
    const updatedThread = await chatThreadRepository.save(thread)

    // push to crawler queue if searching
    if (thread.searchStatus === ESearchStatus.searching) {
      await reportQueue.add(`report-${thread.id}`, { thread })
    }
    return updatedThread
  }
}
