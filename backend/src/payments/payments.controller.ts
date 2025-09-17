// backend/src/payments/payments.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Query, 
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';  // Fixed import path
import { CreatePaymentDto } from './dto/payment.dto';   // Import DTO directly

@ApiTags('Payments')
@Controller('payments')  // Remove 'api/' since main.ts adds 'api/v1' globally
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new payment request' })
  @ApiResponse({ 
    status: 201, 
    description: 'Payment request created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        order_id: { type: 'string' },
        collect_request_id: { type: 'string' },
        payment_url: { type: 'string' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    this.logger.log('Payment creation request received');
    this.logger.log(`School ID: ${createPaymentDto.school_id}`);
    this.logger.log(`Student: ${createPaymentDto.student_info.name}`);
    this.logger.log(`Amount: ${createPaymentDto.order_amount}`);

    // Set default gateway if not provided
    if (!createPaymentDto.gateway_name) {
      createPaymentDto.gateway_name = 'PhonePe';
    }

    const result = await this.paymentsService.createPayment(createPaymentDto);
    this.logger.log('Payment creation completed');
    return result;
  }

  @Get('status/:collectRequestId')
  @ApiOperation({ summary: 'Check payment status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment status retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async checkPaymentStatus(
    @Param('collectRequestId') collectRequestId: string,
    @Query('school_id') schoolId: string
  ) {
    this.logger.log(`Payment status check for: ${collectRequestId}`);
    return await this.paymentsService.checkPaymentStatus(collectRequestId, schoolId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transactions retrieved successfully'
  })
  async getAllTransactions() {
    this.logger.log('Fetching all transactions');
    return await this.paymentsService.getAllTransactions();
  }

  @Get('transactions/school/:schoolId')
  @ApiOperation({ summary: 'Get transactions by school ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'School transactions retrieved successfully'
  })
  async getTransactionsBySchool(@Param('schoolId') schoolId: string) {
    this.logger.log(`Fetching transactions for school: ${schoolId}`);
    return await this.paymentsService.getTransactionsBySchool(schoolId);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for payment service' })
  @ApiResponse({ status: 200, description: 'Payment service is healthy' })
  async healthCheck() {
    this.logger.log('Health check requested');
    return await this.paymentsService.getHealth();
  }
}