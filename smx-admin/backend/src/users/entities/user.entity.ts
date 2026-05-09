import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user-role.enum';
import { SearchKey } from '../../search-keys/entities/search-key.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true, name: 'email' })
  email: string;

  @ApiPropertyOptional({
    description: 'The company of the user',
    example: 'apple',
  })
  @Column({ name: 'company', type: 'varchar', nullable: true })
  company: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.BUYER,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER,
    name: 'role',
  })
  role: UserRole;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'The date and time when the user was created',
    example: '2024-03-06T21:22:03.123Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the user was last updated',
    example: '2024-03-06T21:22:03.123Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The date and time when the user last logged in',
    example: '2024-03-06T21:22:03.123Z',
  })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @OneToMany(() => SearchKey, (searchKey) => searchKey.user)
  searchKeys: SearchKey[];
}
