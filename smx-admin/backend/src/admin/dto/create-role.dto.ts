import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { AdminPermission } from '../entities/admin-role.entity';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Customer Service',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    example: 'Role for customer service representatives',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of permissions assigned to the role',
    enum: AdminPermission,
    isArray: true,
    example: [AdminPermission.VIEW_ADMINS, AdminPermission.CREATE_ADMINS],
  })
  @IsArray()
  @IsNotEmpty()
  permissions: AdminPermission[];
}
