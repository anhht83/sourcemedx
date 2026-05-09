import { ChatThread } from '../entities'
import { BaseRepository } from './base.repository'

export class ChatThreadRepository extends BaseRepository<ChatThread> {
  constructor() {
    super(ChatThread)
  }
}

export const chatThreadRepository = new ChatThreadRepository()
