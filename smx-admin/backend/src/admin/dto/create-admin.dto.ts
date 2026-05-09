import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The username of the admin',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @ApiProperty({
    description: 'The email address of the admin',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the admin account',
    example: 'StrongP@ssw0rd123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'the role to assign to the admin',
    example: 'SUPPORT',
  })
  @IsNotEmpty()
  roleName: string;
}
