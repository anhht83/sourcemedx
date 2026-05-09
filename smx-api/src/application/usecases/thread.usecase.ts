import { ChatThread, Report, User } from '../entities'
import { chatThreadRepository } from '../repositories/chatThread.repository'
import { ThreadPresenter } from '../presenters/thread.presenter'
import { ChatThreadService } from '../services/chatThread.service'
import {
  EAiSearchRequestStatus,
  ESearchStatus,
  ESender,
} from '../enums/chat.enum'
import { AppError } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'
import { reportQueue } from '../queue/reportQueue'
import { EReportType } from '../enums/report.enum'
import { reportRepository } from '../repositories/report.repository'
import { IExportedFile } from '../../libs/xfile/xfile.interface'
import { ChatService } from '../services/chat'
import { ESocketEvent } from '../enums/socket.enum'
import { io } from '../../configs/socket'

export class ThreadUseCase {
  threadService: ChatThreadService
  chatService: ChatService

  constructor() {
    this.threadService = new ChatThreadService()
    this.chatService = new ChatService()
  }

  fetchThreads = async (
    user: User,
  ): Promise<
    Omit<ChatThread, 'messages' | 'userId' | 'user' | 'context'>[]
  > => {
    const threads = await chatThreadRepository.find({
      where: { userId: user.id },
      order: {
        updatedAt: 'DESC',
      },
    })

    return ThreadPresenter.threadsToListView(threads)
  }

  getThread = async (id: string): Promise<ChatThread | null> => {
    const thread = await chatThreadRepository.findOne({
      where: { id },
      relations: ['messages', 'reports'],
    })
    return thread ? ThreadPresenter.threadWithRelationsToView(thread) : null
  }

  completeSearch = async (id: string) => {
    const result = await chatThreadRepository.update(id, {
      searchStatus: ESearchStatus.completed_search,
    })

    if (result.affected === 0) {
      throw new AppError(
        'Thread not found or already updated',
        StatusCodes.NOT_FOUND,
      )
    }
  }

  resetSearch = async (id: string) => {
    const result = await chatThreadRepository.update(id, {
      searchStatus: ESearchStatus.not_ready,
      context: {},
    })

    if (result.affected === 0) {
      throw new AppError(
        'Thread not found or already updated',
        StatusCodes.NOT_FOUND,
      )
    }

    // store empty data message
    const aiMessage = await this.chatService.createChatMessage({
      threadId: id,
      message:
        'No data found for. Please provide other device specifications to proceed.',
      sender: ESender.AI,
      searchStatus: EAiSearchRequestStatus.incomplete_details,
      context: {},
    })
    io.to(id).emit(ESocketEvent.newMessage, aiMessage)
  }

  generateReport = async (threadId: string, userId: string): Promise<void> => {
    if (!threadId || !userId) {
      throw new AppError('Bad request', StatusCodes.BAD_REQUEST)
    }
    const thread = await chatThreadRepository.findOne({
      where: { id: threadId, userId },
    })

    if (!thread) {
      throw new AppError('Chat thread not found.', StatusCodes.NOT_FOUND)
    }
    if (thread.searchStatus !== ESearchStatus.searching) {
      throw new AppError(
        'Chat thread not ready for reporting.',
        StatusCodes.BAD_REQUEST,
      )
    }
    await reportQueue.add(`report-${thread.id}`, { thread })
  }

  storeReportFiles = async ({
    threadId,
    files,
    reportType,
  }: {
    threadId: string
    files: IExportedFile[]
    reportType: EReportType
  }): Promise<Report[]> => {
    // delete existing reports by type of the thead
    await reportRepository.delete({
      threadId,
      reportType,
    })
    // Store each fileUrl as a separate report entry
    const reports: Report[] = []

    for (const file of files) {
      const report = await reportRepository.createAndSave({
        threadId,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        fileType: file.fileType as string,
        reportType,
      })
      reports.push(report)
    }

    return reports
  }
}
