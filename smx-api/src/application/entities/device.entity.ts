import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm'

@Entity('devices')
@Unique(['source', 'sourceId']) // this enables upsert to work
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  name: string

  @Column('text', { nullable: true })
  description?: string

  @Column('jsonb', { nullable: true })
  terms?: { name: string; description?: string }[]

  @Column('text', { name: 'search_text', nullable: true })
  searchText?: string

  @Column({
    name: 'search_vector',
    type: 'tsvector',
    select: false,
    generatedType: 'STORED',
    asExpression: `to_tsvector('english', search_text)`,
  })
  @Index({ spatial: true })
  searchVector?: string

  @Column('text', { nullable: true })
  embedding?: string

  @Column('text', { nullable: true })
  source?: string

  @Column('uuid', { nullable: true, name: 'source_id' })
  sourceId?: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date
}
