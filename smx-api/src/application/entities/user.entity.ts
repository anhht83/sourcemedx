import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { ChatThread } from './chatThread.entity'
import { Token } from './token.entity'
import { SearchKey } from './search-key.entity'
import { UserRole } from '../enums/role.enum'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string

  @Column({ type: 'varchar' })
  company: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER,
  })
  role: UserRole

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  /**
   * One-to-Many relationship with ChatThread
   */
  @OneToMany(() => ChatThread, (thread) => thread.user, { cascade: true })
  chatThreads: ChatThread[]

  /**
   * One-to-Many relationship with Token
   */
  @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens: Token[]

  /**
   * One-to-Many relationship with SearchKey
   */
  @OneToMany(() => SearchKey, (searchKey) => searchKey.user, { cascade: true })
  searchKeys: SearchKey[]
}
