import { IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'BUYER',
  })
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional({
    description: 'The company of the user',
    example: 'apple',
  })
  @IsString()
  @IsOptional()
  company?: string;
}
