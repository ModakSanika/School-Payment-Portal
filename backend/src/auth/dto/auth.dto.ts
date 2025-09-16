import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    maxLength: 50
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: 'user',
    enum: ['admin', 'school_admin', 'user'],
    default: 'user'
  })
  @IsOptional()
  @IsEnum(['admin', 'school_admin', 'user'], { 
    message: 'Role must be one of: admin, school_admin, user' 
  })
  role?: string;

  @ApiPropertyOptional({
    description: 'School ID for school_admin role',
    example: '65b0e6293e9f76a9694d84b4'
  })
  @IsOptional()
  @IsString({ message: 'School ID must be a string' })
  school_id?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer'
  })
  token_type: string;

  @ApiProperty({
    description: 'Token expiration time',
    example: '24h'
  })
  expires_in: string;

  @ApiProperty({
    description: 'User information',
    type: 'object'
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    school_id?: string;
  };
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  school_id?: string;
  iat?: number;
  exp?: number;
}