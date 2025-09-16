import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { FilterTransactionsDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Orders & Transactions')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('transactions')
  @Roles('admin', 'school_admin')
  @ApiOperation({ summary: 'Fetch all transactions with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'success', 'failed', 'processing', 'cancelled'] })
  @ApiQuery({ name: 'school_id', required: false, type: String })
  @ApiQuery({ name: 'gateway', required: false, type: String })
  @ApiQuery({ name: 'start_date', required: false, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'end_date', required: false, type: String, example: '2024-12-31' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'created_at' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], example: 'desc' })
  async getAllTransactions(@Query() filterDto: FilterTransactionsDto) {
    return this.ordersService.getAllTransactions(filterDto);
  }

  @Get('transactions/school/:schoolId')
  @Roles('admin', 'school_admin')
  @ApiOperation({ summary: 'Fetch transactions by school ID' })
  @ApiParam({ name: 'schoolId', type: String, example: '65b0e6293e9f76a9694d84b4' })
  @ApiResponse({
    status: 200,
    description: 'School transactions retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'School not found',
  })
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query() filterDto: FilterTransactionsDto,
  ) {
    return this.ordersService.getTransactionsBySchool(schoolId, filterDto);
  }

  @Get('transaction-status/:customOrderId')
  @ApiOperation({ summary: 'Check transaction status by custom order ID' })
  @ApiParam({ name: 'customOrderId', type: String, example: 'ORD_1704067200000_001' })
  @ApiResponse({
    status: 200,
    description: 'Transaction status retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.ordersService.getTransactionStatus(customOrderId);
  }

  @Post('seed-dummy-data')
  @Roles('admin')
  @ApiOperation({ summary: 'Seed dummy data for testing (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Dummy data seeded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to seed dummy data',
  })
  async seedDummyData() {
    return this.ordersService.seedDummyData();
  }
}