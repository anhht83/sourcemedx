import { ChatMessage, ChatThread } from '../../entities'
import { chatMessageRepository } from '../../repositories/chatMessage.repository'
import { IAiResponse } from '../../interfaces/chat.interface'
import { AppError } from '../../../utils/AppError'
import { StatusCodes } from 'http-status-codes'
import {
  buildMedicalExtractorChain,
  processExtractedResponse,
} from '../../ai/medicalExtractorChain'

export class ChatService {
  createChatMessage = async (
    data: Omit<ChatMessage, 'id' | 'thread'>,
  ): Promise<ChatMessage> => {
    return await chatMessageRepository.createAndSave({
      threadId: data.threadId,
      sender: data.sender,
      message: data.message,
      searchStatus: data.searchStatus ?? null,
      context: data.context,
    })
  }

  aiResponse = async (
    userQuery: string,
    thread: ChatThread,
  ): Promise<IAiResponse> => {
    try {
      const chain = buildMedicalExtractorChain()
      const result = await chain.invoke({
        threadSearchStatus: thread.searchStatus,
        context: JSON.stringify(thread.context),
        userQuery,
      })
      return processExtractedResponse(userQuery, result, thread.context)
    } catch (e: any) {
      console.log(e.message)
      throw new AppError(e?.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
