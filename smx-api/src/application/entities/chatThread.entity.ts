import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Report } from './report.entity'
import { ChatMessage } from './chatMessage.entity'
import { ESearchStatus } from '../enums/chat.enum'

@Entity('chat_threads')
export class ChatThread {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string

  @ManyToOne(() => User, (user) => user.chatThreads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any> // ✅ Accumulated context for the thread

  @Column({
    type: 'varchar',
    name: 'search_status',
    length: 50,
    nullable: true,
  })
  searchStatus?: ESearchStatus | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  /**
   * 💬 One-to-Many relationship with ChatMessage
   */
  @OneToMany(() => ChatMessage, (message) => message.thread, { cascade: true })
  messages: ChatMessage[]

  /**
   * 💬 One-to-Many relationship with Report
   */
  @OneToMany(() => Report, (report) => report.thread, { cascade: true })
  reports?: Report[]
}
