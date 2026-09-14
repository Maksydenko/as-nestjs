import { ApiProperty } from '@nestjs/swagger'

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf
} from 'class-validator'

import {
  IsStrictPhoneNumber,
  IsValidTld,
  Match,
  ToLowerCase,
  Trim
} from 'src/shared/decorators'

export class LoginDto {
  @ApiProperty({ example: 'email@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  @IsValidTld()
  @ToLowerCase()
  @Trim()
  email!: string

  @ApiProperty({ example: 'Pa$$w0rd!', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string
}

export class RegisterDto {
  @ApiProperty({ example: 'Pa$$w0rd!', required: true })
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  @MinLength(8)
  confirmPassword!: string

  @ApiProperty({ example: 'email@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  @IsValidTld()
  @ToLowerCase()
  @Trim()
  email!: string

  @ApiProperty({ example: 'Name', required: true })
  @IsNotEmpty()
  @IsString()
  @Trim()
  firstName!: string

  @ApiProperty({ example: 'Surname', required: true })
  @IsNotEmpty()
  @IsString()
  @Trim()
  lastName!: string

  @ApiProperty({ example: '+380987654321', required: true })
  @IsNotEmpty()
  @IsStrictPhoneNumber()
  @IsString()
  @Trim()
  mobileNumber!: string

  @ApiProperty({ example: 'Pa$$w0rd!', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string
}

export class UpdateDto {
  @ApiProperty({ example: 'Pa$$w0rd!', required: false })
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  @MinLength(8)
  @ValidateIf((dto: UpdateDto) => dto.password !== undefined)
  confirmPassword?: string

  @ApiProperty({ example: 'email@gmail.com', required: false })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @IsValidTld()
  @ToLowerCase()
  @Trim()
  email?: string

  @ApiProperty({ example: 'Name', required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Trim()
  firstName?: string

  @ApiProperty({ example: 'Surname', required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Trim()
  lastName?: string

  @ApiProperty({ example: '+380987654321', required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsStrictPhoneNumber()
  @IsString()
  @Trim()
  mobileNumber?: string

  @ApiProperty({ example: 'Pa$$w0rd!', required: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ValidateIf((dto: UpdateDto) => dto.password !== undefined)
  password?: string
}
