import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentResponseDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'school_admin', 'user')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new payment request' })
  @ApiResponse({
    status: 201,
    description: 'Payment request created successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Payment gateway integration failed',
  })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Get('status/:customOrderId')
  @Public()
  @ApiOperation({ summary: 'Get payment status by custom order ID' })
  @ApiParam({ name: 'customOrderId', type: String, example: 'ORD_1704067200000_001' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  async getPaymentStatus(@Param('customOrderId') customOrderId: string) {
    return this.paymentsService.getPaymentStatus(customOrderId);
  }
}