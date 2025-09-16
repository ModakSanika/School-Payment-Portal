import { IsNotEmpty, IsString, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderInfoDto {
  @ApiProperty({ example: 'ORDER123456' })
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  order_amount: number;

  @ApiProperty({ example: 2200 })
  @IsNumber()
  transaction_amount: number;

  @ApiProperty({ example: 'PhonePe' })
  @IsString()
  gateway: string;

  @ApiProperty({ example: 'YESBNK222' })
  @IsString()
  bank_reference: string;

  @ApiProperty({ 
    example: 'success',
    enum: ['pending', 'success', 'failed', 'processing', 'cancelled']
  })
  @IsEnum(['pending', 'success', 'failed', 'processing', 'cancelled'])
  status: string;

  @ApiProperty({ 
    example: 'upi',
    enum: ['upi', 'card', 'netbanking', 'wallet', 'cash']
  })
  @IsEnum(['upi', 'card', 'netbanking', 'wallet', 'cash'])
  payment_mode: string;

  @ApiProperty({ example: 'success@ybl' })
  @IsString()
  payemnt_details: string; // Note: typo in original spec

  @ApiProperty({ example: 'payment success' })
  @IsString()
  Payment_message: string; // Note: capital P in original spec

  @ApiProperty({ example: '2025-04-23T08:14:21.945+00:00' })
  @IsString()
  payment_time: string;

  @ApiProperty({ example: 'NA' })
  @IsString()
  error_message: string;
}

export class WebhookPayloadDto {
  @ApiProperty({ example: 200 })
  @IsNumber()
  status: number;

  @ApiProperty({ type: OrderInfoDto })
  @ValidateNested()
  @Type(() => OrderInfoDto)
  order_info: OrderInfoDto;
}

export class WebhookResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Webhook processed successfully' })
  message: string;

  @ApiProperty({ example: 'ORDER123456' })
  order_id: string;

  @ApiProperty({ example: 'success' })
  status: string;
}