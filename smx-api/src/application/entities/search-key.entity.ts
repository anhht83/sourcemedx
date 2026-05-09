import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'
import { SearchKeyStatus } from '../enums/searchKey.enum'

@Entity('search_keys')
export class SearchKey {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', unique: true, name: 'key' })
  key: string

  @Column({
    type: 'enum',
    enum: SearchKeyStatus,
    default: SearchKeyStatus.AVAILABLE,
    name: 'status',
  })
  status: SearchKeyStatus

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt: Date

  @ManyToOne(() => User, (user) => user.searchKeys)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({
    name: 'discount_applied',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountApplied: number

  @Column({ name: 'stripe_payment_id', type: 'varchar', nullable: true })
  stripePaymentId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
