import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AdminRole } from './admin-role.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('admin_users')
export class AdminUser {
  @ApiProperty({
    description: 'The unique identifier of the admin user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The username of the admin user',
    example: 'johndoe',
  })
  @Column({ unique: true, name: 'username' })
  username: string;

  @ApiProperty({
    description: 'The email address of the admin user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ name: 'password' })
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Whether the admin user is active',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'The role assigned to the admin user',
    type: () => AdminRole,
  })
  @ManyToOne(() => AdminRole, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: AdminRole;

  @ApiProperty({
    description: 'The date and time when the admin user was created',
    example: '2024-03-06T21:22:03.123Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the admin user was last updated',
    example: '2024-03-06T21:22:03.123Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The date and time when the admin user was last logged in',
    example: '2024-03-06T21:22:03.123Z',
  })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;
}
