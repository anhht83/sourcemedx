import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AdminUser } from './admin-user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AdminPermission {
  // Admin user management permissions
  VIEW_ADMINS = 'VIEW_ADMINS',
  CREATE_ADMINS = 'CREATE_ADMINS',
  UPDATE_ADMINS = 'UPDATE_ADMINS',
  DELETE_ADMINS = 'DELETE_ADMINS',
  BLOCK_ADMINS = 'BLOCK_ADMINS',

  // Activity log permissions
  VIEW_LOGS = 'VIEW_LOGS',
  EXPORT_LOGS = 'EXPORT_LOGS',
}

@Entity('admin_roles')
export class AdminRole {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the role',
    example: 'SUPER_ADMIN',
  })
  @Column({ unique: true, name: 'name' })
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    example: 'Has full access to all admin features',
  })
  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string;

  @ApiProperty({
    description: 'The list of permissions assigned to this role',
    enum: AdminPermission,
    isArray: true,
    example: [AdminPermission.VIEW_ADMINS, AdminPermission.CREATE_ADMINS],
  })
  @Column({
    type: 'enum',
    enum: AdminPermission,
    array: true,
    default: [],
    name: 'permissions',
  })
  permissions: AdminPermission[];

  @ApiProperty({
    description: 'The list of admins assigned to this role',
    type: () => [AdminUser],
  })
  @OneToMany(() => AdminUser, (admin) => admin.role)
  admins: AdminUser[];

  @ApiProperty({
    description: 'The date and time when the role was created',
    example: '2024-03-06T21:22:03.123Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the role was last updated',
    example: '2024-03-06T21:22:03.123Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
