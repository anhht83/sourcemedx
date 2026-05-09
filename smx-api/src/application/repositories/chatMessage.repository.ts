import { ChatMessage } from '../entities'
import { BaseRepository } from './base.repository'

export class ChatMessageRepository extends BaseRepository<ChatMessage> {
  constructor() {
    super(ChatMessage)
  }
}

export const chatMessageRepository = new ChatMessageRepository()
