import { IsNotEmpty, IsString, IsNumber, IsEmail, IsEnum, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class StudentInfoDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'STU001' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreatePaymentDto {
  @ApiProperty({ example: '65b0e6293e9f76a9694d84b4' })
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ApiProperty({ example: '65b0e552dd31950a9b41c5ba' })
  @IsString()
  @IsNotEmpty()
  trustee_id: string;

  @ApiProperty({ type: StudentInfoDto })
  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info: StudentInfoDto;

  @ApiProperty({ 
    example: 'PhonePe',
    enum: ['PhonePe', 'Paytm', 'Razorpay', 'UPI', 'NetBanking', 'Card']
  })
  @IsEnum(['PhonePe', 'Paytm', 'Razorpay', 'UPI', 'NetBanking', 'Card'])
  gateway_name: string;

  @ApiProperty({ example: 1000, minimum: 1 })
  @IsNumber()
  @Min(1)
  order_amount: number;
}

export class PaymentResponseDto {
  @ApiProperty({ example: 'ORD_1704067200000_001' })
  custom_order_id: string;

  @ApiProperty({ example: 'https://payment-gateway.com/pay/xyz123' })
  payment_url: string;

  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Payment request created successfully' })
  message: string;

  @ApiProperty({ example: 1000 })
  order_amount: number;

  @ApiProperty({ example: 'PhonePe' })
  gateway: string;
}