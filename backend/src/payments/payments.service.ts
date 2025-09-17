// backend/src/payments/payments.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';

// Import schemas
import { Order } from '../orders/schemas/order.schema';
import { OrderStatus } from '../orders/schemas/order-status.schema';

// Import DTO
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly EDVIRON_API_BASE_URL: string;
  private readonly EDVIRON_API_KEY: string;
  private readonly PG_KEY: string;
  private readonly PG_SECRET_KEY: string;
  private readonly FRONTEND_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
  ) {
    this.EDVIRON_API_BASE_URL = this.configService.get<string>('EDVIRON_API_BASE_URL');
    this.EDVIRON_API_KEY = this.configService.get<string>('EDVIRON_API_KEY');
    this.PG_KEY = this.configService.get<string>('PG_KEY');
    this.PG_SECRET_KEY = this.configService.get<string>('PG_SECRET_KEY');
    this.FRONTEND_URL = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

    // Debug logging to troubleshoot environment variables
    this.logger.log('=== PaymentsService Configuration ===');
    this.logger.log(`Edviron API URL: ${this.EDVIRON_API_BASE_URL}`);
    this.logger.log(`PG Key: ${this.PG_KEY}`);
    this.logger.log(`API Key set: ${!!this.EDVIRON_API_KEY}`);
    this.logger.log(`API Key length: ${this.EDVIRON_API_KEY?.length || 0}`);
    this.logger.log(`PG Secret set: ${!!this.PG_SECRET_KEY}`);
    this.logger.log(`PG Secret value: "${this.PG_SECRET_KEY}"`);
    this.logger.log(`Frontend URL: ${this.FRONTEND_URL}`);
    this.logger.log(`Mock Mode: ${this.isMockMode()}`);
    this.logger.log('=====================================');
  }

  /**
   * Check if we're in mock mode (no real secret key from Edviron)
   */
  private isMockMode(): boolean {
    if (!this.PG_SECRET_KEY) {
      this.logger.log('Mock mode: No PG_SECRET_KEY found');
      return true;
    }

    const mockKeywords = [
      'placeholder',
      'test',
      'waiting',
      'fake',
      'demo',
      'mock',
      'temp',
      'development',
      'dev',
      'sample'
    ];

    const lowerSecretKey = this.PG_SECRET_KEY.toLowerCase();
    
    for (const keyword of mockKeywords) {
      if (lowerSecretKey.includes(keyword)) {
        this.logger.log(`Mock mode: PG_SECRET_KEY contains "${keyword}"`);
        return true;
      }
    }

    if (this.PG_SECRET_KEY.length < 20) {
      this.logger.log(`Mock mode: PG_SECRET_KEY too short (${this.PG_SECRET_KEY.length} chars)`);
      return true;
    }

    if (this.PG_SECRET_KEY === this.PG_KEY) {
      this.logger.log('Mock mode: PG_SECRET_KEY same as PG_KEY');
      return true;
    }

    this.logger.log('Production mode: Valid PG_SECRET_KEY detected');
    return false;
  }

  /**
   * Create JWT signature for Edviron API
   */
  private createJWTSignature(payload: any): string {
    try {
      if (!this.PG_SECRET_KEY) {
        throw new Error('PG_SECRET_KEY is not configured');
      }

      const token = jwt.sign(payload, this.PG_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '1h'
      });
      
      this.logger.log('JWT signature created successfully');
      return token;
    } catch (error) {
      this.logger.error('Failed to create JWT signature:', error.message);
      throw new HttpException(
        'Failed to create JWT signature',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create mock payment (when PG secret key is not available)
   */
  private async createMockPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      this.logger.warn('🎭 RUNNING IN MOCK MODE - PG_SECRET_KEY not provided by Edviron');
      this.logger.log('Creating MOCK payment request...');
      this.logger.log(`School ID: ${createPaymentDto.school_id}`);
      this.logger.log(`Amount: ${createPaymentDto.order_amount}`);
      this.logger.log(`Student: ${createPaymentDto.student_info.name}`);

      // Save to database as usual
      const order = new this.orderModel({
        school_id: createPaymentDto.school_id,
        trustee_id: '65b0e552dd31950a9b41c5ba',
        student_info: createPaymentDto.student_info,
        gateway_name: createPaymentDto.gateway_name || 'PhonePe',
        order_amount: createPaymentDto.order_amount,
        fee_type: createPaymentDto.fee_type,
        description: createPaymentDto.description,
        due_date: new Date(createPaymentDto.due_date),
        callback_url: createPaymentDto.callback_url,
        redirect_url: createPaymentDto.redirect_url,
        status: 'pending',
        created_at: new Date()
      });

      const savedOrder = await order.save();
      this.logger.log(`Mock order saved with ID: ${savedOrder._id}`);

      // Generate mock collect ID
      const mockCollectId = `MOCK_${Date.now()}`;
      this.logger.log(`Generated mock collect ID: ${mockCollectId}`);
      
      // Create demo payment URL (redirect to your frontend demo page)
      const demoPaymentUrl = `${this.FRONTEND_URL}/demo-payment?collect_id=${mockCollectId}&amount=${createPaymentDto.order_amount}&student=${encodeURIComponent(createPaymentDto.student_info.name)}`;
      this.logger.log(`Demo payment URL: ${demoPaymentUrl}`);
      
      // Update order with mock data
      await this.orderModel.findByIdAndUpdate(savedOrder._id, {
        collect_request_id: mockCollectId,
        payment_url: demoPaymentUrl
      });

      // Create order status
      const orderStatus = new this.orderStatusModel({
        collect_id: savedOrder._id,
        order_amount: createPaymentDto.order_amount,
        transaction_amount: 0,
        payment_mode: 'demo',
        payment_details: 'Mock payment for development',
        bank_reference: 'MOCK_REF_' + Date.now(),
        payment_message: 'Mock payment created - waiting for real PG_SECRET_KEY from Edviron',
        status: 'pending',
        error_message: '',
        payment_time: new Date()
      });

      await orderStatus.save();
      this.logger.log('Mock order status saved');

      return {
        success: true,
        order_id: savedOrder._id,
        collect_request_id: mockCollectId,
        payment_url: demoPaymentUrl,
        message: 'DEMO MODE: Payment created successfully (awaiting real Edviron credentials)',
        demo_mode: true
      };

    } catch (error) {
      this.logger.error('Mock payment creation error:', error.message);
      this.logger.error('Stack trace:', error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create mock payment',
          error: error.message,
          demo_mode: true
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create real payment via Edviron API
   */
  private async createRealPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      this.logger.log('🚀 Creating REAL payment request via Edviron API...');
      this.logger.log(`School ID: ${createPaymentDto.school_id}`);
      this.logger.log(`Amount: ${createPaymentDto.order_amount}`);
      this.logger.log(`Student: ${createPaymentDto.student_info.name}`);

      // Create Order record in database first
      const order = new this.orderModel({
        school_id: createPaymentDto.school_id,
        trustee_id: '65b0e552dd31950a9b41c5ba',
        student_info: createPaymentDto.student_info,
        gateway_name: createPaymentDto.gateway_name || 'PhonePe',
        order_amount: createPaymentDto.order_amount,
        fee_type: createPaymentDto.fee_type,
        description: createPaymentDto.description,
        due_date: new Date(createPaymentDto.due_date),
        callback_url: createPaymentDto.callback_url,
        redirect_url: createPaymentDto.redirect_url,
        status: 'pending',
        created_at: new Date()
      });

      const savedOrder = await order.save();
      this.logger.log(`Order saved with ID: ${savedOrder._id}`);

      // Create JWT payload for Edviron API
      const jwtPayload = {
        school_id: createPaymentDto.school_id,
        amount: createPaymentDto.order_amount.toString(),
        callback_url: createPaymentDto.callback_url
      };

      this.logger.log('JWT payload:', jwtPayload);

      // Generate JWT signature
      const jwtSign = this.createJWTSignature(jwtPayload);

      // Prepare Edviron API request
      const edvironRequest = {
        school_id: createPaymentDto.school_id,
        amount: createPaymentDto.order_amount.toString(),
        callback_url: createPaymentDto.callback_url,
        sign: jwtSign
      };

      this.logger.log('Calling Edviron API...');
      this.logger.log('Request body:', {
        ...edvironRequest,
        sign: jwtSign.substring(0, 20) + '...'
      });

      // Call Edviron API
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.EDVIRON_API_BASE_URL}/create-collect-request`,
          edvironRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.EDVIRON_API_KEY}`
            },
            timeout: 30000
          }
        )
      );

      const edvironResponse = response.data;
      this.logger.log('Edviron API response received');
      this.logger.log(`Collect Request ID: ${edvironResponse.collect_request_id}`);
      this.logger.log(`Payment URL: ${edvironResponse.Collect_request_url}`);

      // Update order with collect_request_id
      await this.orderModel.findByIdAndUpdate(savedOrder._id, {
        collect_request_id: edvironResponse.collect_request_id,
        payment_url: edvironResponse.Collect_request_url
      });

      // Create initial order status
      const orderStatus = new this.orderStatusModel({
        collect_id: savedOrder._id,
        order_amount: createPaymentDto.order_amount,
        transaction_amount: 0,
        payment_mode: '',
        payment_details: '',
        bank_reference: '',
        payment_message: 'Payment created via Edviron API',
        status: 'pending',
        error_message: '',
        payment_time: new Date()
      });

      await orderStatus.save();
      this.logger.log('Order status saved');

      return {
        success: true,
        order_id: savedOrder._id,
        collect_request_id: edvironResponse.collect_request_id,
        payment_url: edvironResponse.Collect_request_url,
        message: 'Payment request created successfully via Edviron',
        demo_mode: false
      };

    } catch (error) {
      this.logger.error('Real payment creation error:', error.message);
      this.logger.error('Stack trace:', error.stack);

      if (error.response) {
        this.logger.error('Edviron API error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        throw new HttpException(
          {
            success: false,
            message: 'Payment gateway error',
            error: error.response.data || error.message,
            demo_mode: false
          },
          error.response.status || HttpStatus.BAD_REQUEST
        );
      } else if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          {
            success: false,
            message: 'Payment gateway timeout',
            error: 'Request timed out',
            demo_mode: false
          },
          HttpStatus.REQUEST_TIMEOUT
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: 'Failed to create payment',
            error: error.message,
            demo_mode: false
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  /**
   * Main method to create payment (routes to mock or real based on configuration)
   */
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const mockMode = this.isMockMode();
    this.logger.log(`Payment creation mode: ${mockMode ? 'MOCK' : 'REAL'}`);
    
    if (mockMode) {
      return this.createMockPayment(createPaymentDto);
    } else {
      return this.createRealPayment(createPaymentDto);
    }
  }

  /**
   * Check payment status via Edviron API
   */
  async checkPaymentStatus(collectRequestId: string, schoolId: string): Promise<any> {
    try {
      this.logger.log(`Checking payment status for: ${collectRequestId}`);

      // If it's a mock payment, return mock status
      if (collectRequestId.startsWith('MOCK_')) {
        this.logger.log('Returning mock payment status');
        return {
          success: true,
          data: {
            status: 'PENDING',
            amount: 0,
            details: { payment_methods: null },
            jwt: 'mock_jwt_token'
          },
          message: 'Mock payment status - waiting for real Edviron credentials'
        };
      }

      // For real payments, check with Edviron API
      if (this.isMockMode()) {
        throw new HttpException(
          {
            success: false,
            message: 'Cannot check real payment status in mock mode',
            error: 'PG_SECRET_KEY not configured'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Create JWT payload for status check
      const jwtPayload = {
        school_id: schoolId,
        collect_request_id: collectRequestId
      };

      // Generate JWT signature
      const jwtSign = this.createJWTSignature(jwtPayload);

      this.logger.log('Calling Edviron status API...');

      // Call Edviron API
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.EDVIRON_API_BASE_URL}/collect-request/${collectRequestId}`,
          {
            params: {
              school_id: schoolId,
              sign: jwtSign
            },
            headers: {
              'Authorization': `Bearer ${this.EDVIRON_API_KEY}`
            },
            timeout: 15000
          }
        )
      );

      this.logger.log('Payment status retrieved successfully');

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      this.logger.error('Payment status check error:', error.message);

      throw new HttpException(
        {
          success: false,
          message: 'Failed to check payment status',
          error: error.response?.data || error.message
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get all transactions (combines Order and OrderStatus)
   */
  async getAllTransactions(): Promise<any> {
    try {
      this.logger.log('Fetching all transactions...');

      const transactions = await this.orderModel.aggregate([
        {
          $lookup: {
            from: 'orderstatuses',
            localField: '_id',
            foreignField: 'collect_id',
            as: 'status'
          }
        },
        {
          $unwind: {
            path: '$status',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            collect_id: '$_id',
            collect_request_id: 1,
            school_id: 1,
            student_info: 1,
            gateway_name: 1,
            order_amount: 1,
            transaction_amount: '$status.transaction_amount',
            fee_type: 1,
            description: 1,
            status: '$status.status',
            payment_mode: '$status.payment_mode',
            payment_time: '$status.payment_time',
            created_at: 1
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ]);

      this.logger.log(`Found ${transactions.length} transactions`);

      return {
        success: true,
        data: transactions
      };

    } catch (error) {
      this.logger.error('Get transactions error:', error.message);
      throw new HttpException(
        'Failed to fetch transactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get transactions by school ID
   */
  async getTransactionsBySchool(schoolId: string): Promise<any> {
    try {
      this.logger.log(`Fetching transactions for school: ${schoolId}`);

      const transactions = await this.orderModel.aggregate([
        {
          $match: { school_id: schoolId }
        },
        {
          $lookup: {
            from: 'orderstatuses',
            localField: '_id',
            foreignField: 'collect_id',
            as: 'status'
          }
        },
        {
          $unwind: {
            path: '$status',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            collect_id: '$_id',
            collect_request_id: 1,
            school_id: 1,
            student_info: 1,
            gateway_name: 1,
            order_amount: 1,
            transaction_amount: '$status.transaction_amount',
            fee_type: 1,
            description: 1,
            status: '$status.status',
            payment_mode: '$status.payment_mode',
            payment_time: '$status.payment_time',
            created_at: 1
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ]);

      this.logger.log(`Found ${transactions.length} transactions for school ${schoolId}`);

      return {
        success: true,
        data: transactions
      };

    } catch (error) {
      this.logger.error('Get school transactions error:', error.message);
      throw new HttpException(
        'Failed to fetch school transactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Health check
   */
  async getHealth(): Promise<any> {
    const mockMode = this.isMockMode();
    
    return {
      success: true,
      message: 'Payment service is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mode: mockMode ? 'DEMO/MOCK' : 'PRODUCTION',
      config: {
        edviron_api_configured: !!this.EDVIRON_API_BASE_URL,
        api_key_configured: !!this.EDVIRON_API_KEY,
        pg_key_configured: !!this.PG_KEY,
        pg_secret_configured: !!this.PG_SECRET_KEY && !mockMode,
        frontend_url: this.FRONTEND_URL,
        mock_mode: mockMode,
        pg_secret_length: this.PG_SECRET_KEY?.length || 0
      }
    };
  }
}