import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm'
import { IFDARecall, IOpenFDA } from './fdaRecall.interface'

@Entity('fda_recalls')
export class FDARecall implements IFDARecall {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true, name: 'cfres_id' })
  cfresId: string

  @Column({ nullable: true, name: 'product_res_number' })
  productResNumber: string

  @Column({ nullable: true, name: 'event_date_initiated', type: 'date' })
  eventDateInitiated: string

  @Column({ nullable: true, name: 'event_date_posted', type: 'date' })
  eventDatePosted: string

  @Column({ nullable: true, name: 'recall_status' })
  recallStatus: string

  @Column({ nullable: true, name: 'res_event_number' })
  resEventNumber: string

  @Column({ nullable: true, name: 'product_code' })
  productCode: string

  @Column({ type: 'jsonb', nullable: true, name: 'k_numbers' })
  kNumbers?: string[]

  @Column({ type: 'text', name: 'product_description' })
  productDescription: string

  @Column({ type: 'text', nullable: true, name: 'code_info' })
  codeInfo?: string

  @Column({ nullable: true, name: 'recalling_firm' })
  recallingFirm: string

  @Column({ nullable: true })
  address1?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true, type: 'text', name: 'reason_for_recall' })
  reasonForRecall: string

  @Column({ type: 'text', nullable: true, name: 'root_cause_description' })
  rootCauseDescription?: string

  @Column({ nullable: true, type: 'text' })
  action: string

  @Column({ nullable: true, name: 'product_quantity' })
  productQuantity: string

  @Column({ type: 'text', nullable: true, name: 'distribution_pattern' })
  distributionPattern?: string

  @Column({ type: 'jsonb', nullable: true })
  openfda?: IOpenFDA

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
}
