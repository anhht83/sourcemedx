import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ChatThread } from './chatThread.entity'
import { EAiSearchRequestStatus, ESender } from '../enums/chat.enum'
import { ISearchRequestContext } from '../interfaces/chat.interface'

/**
 * 💬 ChatMessage entity represents individual messages in a chat thread.
 */
@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'thread_id' })
  threadId: string

  @ManyToOne(() => ChatThread, (thread) => thread.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'thread_id' })
  thread?: ChatThread

  @Column({ type: 'varchar', length: 50 })
  sender: ESender // 'user' or 'ai'

  @Column({ type: 'text' })
  message: string // 💬 The message content

  @Column({
    type: 'varchar',
    name: 'search_status',
    length: 50,
    nullable: true,
  })
  searchStatus?: EAiSearchRequestStatus | null

  @Column({ type: 'jsonb', nullable: true })
  context?: ISearchRequestContext | null // JSONB context extracted from the message for product search

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date // Auto-set when the message is created

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date //Auto-updated when the message is modified
}
