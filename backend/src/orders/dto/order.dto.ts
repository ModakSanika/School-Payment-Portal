import { IsNotEmpty, IsString, IsNumber, IsEmail, IsEnum, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class CreateOrderDto {
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

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'created_at',
    description: 'Field to sort by'
  })
  @IsOptional()
  @IsString()
  sort?: string = 'created_at';

  @ApiPropertyOptional({ 
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order'
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}

export class FilterTransactionsDto extends PaginationDto {
  @ApiPropertyOptional({ 
    example: 'success',
    enum: ['pending', 'success', 'failed', 'processing', 'cancelled']
  })
  @IsOptional()
  @IsEnum(['pending', 'success', 'failed', 'processing', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ example: '65b0e6293e9f76a9694d84b4' })
  @IsOptional()
  @IsString()
  school_id?: string;

  @ApiPropertyOptional({ example: 'PhonePe' })
  @IsOptional()
  @IsString()
  gateway?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsString()
  end_date?: string;
}