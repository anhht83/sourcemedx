import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity('newsletters')
export class Newsletter extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  subject: string

  @Column({ type: 'text' })
  content: string

  @CreateDateColumn()
  sentAt: Date
}
