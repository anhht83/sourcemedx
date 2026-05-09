import { ChatDTO } from '../dtos/chat.dto'
import { ChatService } from '../services/chat'
import { ChatMessage, ChatThread, User } from '../entities'
import {
  EAiSearchRequestStatus,
  ESearchStatus,
  ESender,
} from '../enums/chat.enum'
import { ChatPresenter } from '../presenters/chat.presenter'
import { chatMessageRepository } from '../repositories/chatMessage.repository'
import { AppError } from '../../utils/AppError'
import { aiQueue } from '../queue/aiQueue'
import { ChatThreadService } from '../services/chatThread.service'
import { EQueueName } from '../enums/queu.enum'

export class ChatUseCase {
  chatService: ChatService
  threadService: ChatThreadService

  constructor() {
    this.chatService = new ChatService()
    this.threadService = new ChatThreadService()
  }

  newMessage = async (
    { message, threadId = '' }: ChatDTO,
    user?: User,
  ): Promise<ChatMessage> => {
    if (!user) {
      throw new AppError('User not found')
    }
    // Valid chat thread,
    // if thread is not provided, start a new chat thread
    const thread = await this.threadService.findOrCreate(
      threadId,
      user.id,
      message,
    )

    // Store user's message
    const userMessage = await this.chatService.createChatMessage({
      threadId: thread.id,
      message,
      sender: ESender.USER,
    })

    // Add AI response request to queue
    await aiQueue.add(`${EQueueName.ai_response_queue}-add-${thread.id}`, {
      message: userMessage.message,
      thread,
    })

    return ChatPresenter.messageToView(userMessage)
  }

  aiResponse = async (
    message: string,
    thread: ChatThread,
  ): Promise<
    ChatMessage & {
      threadSearchStatus?: ESearchStatus | null
    }
  > => {
    let threadSearchStatus = thread.searchStatus
    // get response from AI
    const aiResponse = await this.chatService.aiResponse(message, thread)

    // store ai message
    const aiMessage = await this.chatService.createChatMessage({
      threadId: thread.id,
      message: aiResponse.message || '',
      sender: ESender.AI,
      searchStatus: aiResponse.searchStatus,
      context: aiResponse.context,
    })

    // update thread context to be used in next chat
    if (
      aiResponse.searchStatus &&
      aiResponse.searchStatus !== EAiSearchRequestStatus.not_a_search_request &&
      aiResponse.context
    ) {
      const updatedThread = await this.threadService.update(thread, {
        searchStatus: aiResponse.searchStatus,
        context: aiResponse.context,
      })
      threadSearchStatus = updatedThread.searchStatus
    }

    return { ...ChatPresenter.messageToView(aiMessage), threadSearchStatus }
  }

  getMessagesByThread = async (
    threadId: string,
  ): Promise<Omit<ChatMessage, 'thread'>[]> => {
    const messages = await chatMessageRepository.find({
      where: { threadId },
      order: {
        createdAt: 'ASC',
      },
    })
    return ChatPresenter.messagesToListView(messages)
  }
}
