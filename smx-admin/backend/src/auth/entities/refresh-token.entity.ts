import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AdminUser } from '../../admin/entities/admin-user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('admin_refresh_tokens')
export class RefreshToken {
  @ApiProperty({
    description: 'The unique identifier of the refresh token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The refresh token string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Column()
  token: string;

  @ApiProperty({
    description: 'Whether the refresh token has been revoked',
    example: false,
  })
  @Column({ default: false, name: 'is_revoked' })
  isRevoked: boolean;

  @ApiProperty({
    description: 'The user agent of the device that created the token',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  @Column({ default: '', name: 'user_agent' })
  userAgent: string;

  @ApiProperty({
    description: 'The IP address of the device that created the token',
    example: '192.168.1.1',
  })
  @Column({ default: '127.0.0.1', name: 'ip_address' })
  ipAddress: string;

  @ApiProperty({
    description: 'The date and time when the token expires',
    example: '2024-03-13T21:22:03.123Z',
  })
  @Column({ default: '2024-03-06T21:22:03.123Z', name: 'expires_at' })
  expiresAt: Date;

  @ApiProperty({
    description: 'The admin user who owns this refresh token',
    type: () => AdminUser,
  })
  @JoinColumn({ name: 'admin_id' })
  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  admin: AdminUser;

  @ApiProperty({
    description: 'The date and time when the token was created',
    example: '2024-03-06T21:22:03.123Z',
  })
  @CreateDateColumn({ default: '2024-03-06T21:22:03.123Z', name: 'created_at' })
  createdAt: Date;
}
