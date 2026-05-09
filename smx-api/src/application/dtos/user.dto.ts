import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator'

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsOptional()
  company?: string
}

export class UpdateUserDTO {
  @IsOptional()
  @MinLength(6)
  password?: string

  @IsOptional()
  firstName?: string

  @IsOptional()
  lastName?: string

  @IsOptional()
  company?: string
}
