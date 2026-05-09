import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'The username of the admin',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username?: string;

  @ApiProperty({
    description: 'the role to assign to the admin',
    example: 'SUPPORT',
  })
  @IsString()
  @IsNotEmpty()
  roleName?: string;
}
