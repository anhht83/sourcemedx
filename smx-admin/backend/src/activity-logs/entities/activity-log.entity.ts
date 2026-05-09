import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { AdminUser } from '../../admin/entities/admin-user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ActivityType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum EntityType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ROLE = 'ROLE',
}

@Entity('activity_logs')
@Index(['entityType', 'entityId'])
@Index(['activityType', 'createdAt'])
@Index(['admin', 'createdAt'])
export class ActivityLog {
  @ApiProperty({
    description: 'The unique identifier of the activity log',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The admin user who performed the action',
    type: () => AdminUser,
  })
  @JoinColumn({ name: 'admin_id' })
  @ManyToOne(() => AdminUser)
  admin: AdminUser;

  @ApiProperty({
    description: 'The type of activity performed',
    enum: ActivityType,
    example: ActivityType.CREATE,
  })
  @Column({
    type: 'enum',
    enum: ActivityType,
    name: 'activity_type',
  })
  activityType: ActivityType;

  @ApiProperty({
    description: 'The type of entity that was affected',
    enum: EntityType,
    example: EntityType.ADMIN,
  })
  @Column({
    type: 'enum',
    enum: EntityType,
    name: 'entity_type',
  })
  entityType: EntityType;

  @ApiProperty({
    description: 'The ID of the entity that was affected',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ default: '', name: 'entity_id' })
  entityId: string;

  @ApiProperty({
    description: 'Additional details about the activity',
    example: { username: 'johndoe', email: 'john.doe@example.com' },
  })
  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;

  @ApiProperty({
    description: 'The IP address from which the activity was performed',
    example: '192.168.1.1',
  })
  @Column({ default: '127.0.0.1', name: 'ip_address' })
  ipAddress: string;

  @ApiProperty({
    description:
      'The user agent of the device from which the activity was performed',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  @Column({ default: '', name: 'user_agent' })
  userAgent: string;

  @ApiProperty({
    description: 'The date and time when the activity was logged',
    example: '2024-03-06T21:22:03.123Z',
  })
  @CreateDateColumn({ default: '2024-03-06T21:22:03.123Z', name: 'created_at' })
  createdAt: Date;
}
