// backend/src/payments/dto/payment.dto.ts
import { IsString, IsNumber, IsEmail, IsObject, ValidateNested, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StudentInfoDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'STU001' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  phone: string;
}

export class CreatePaymentDto {
  @ApiProperty({ example: '65b0e6293e9f76a9694d84b4' })
  @IsString()
  school_id: string;

  @ApiProperty({ type: StudentInfoDto })
  @IsObject()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info: StudentInfoDto;

  @ApiProperty({ example: 1000, minimum: 1, maximum: 100000 })
  @IsNumber()
  @Min(1)
  @Max(100000)
  order_amount: number;

  @ApiProperty({ example: 'PhonePe', required: false })
  @IsString()
  @IsOptional()
  gateway_name?: string;

  @ApiProperty({ example: 'Tuition Fee' })
  @IsString()
  fee_type: string;

  @ApiProperty({ example: 'Monthly tuition fee payment' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-01-31' })
  @IsString()
  due_date: string;

  @ApiProperty({ example: 'http://localhost:5173/dashboard/payment-callback' })
  @IsString()
  callback_url: string;

  @ApiProperty({ example: 'http://localhost:5173/dashboard/transactions' })
  @IsString()
  redirect_url: string;
}