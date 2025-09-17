// backend/src/payments/payments.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { Order } from '../orders/schemas/order.schema';
import { OrderStatus } from '../orders/schemas/order-status.schema';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
    private configService: ConfigService,
  ) {
    this.logger.log('Payment Service initialized');
  }

  private createJWTSignature(payload: any): string {
    try {
      const secret = this.configService.get<string>('PG_SECRET_KEY') || 'edvtest01';
      const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
      this.logger.log('JWT signature created');
      return token;
    } catch (error) {
      this.logger.error('JWT creation failed:', error.message);
      return 'demo_jwt_token';
    }
  }

  async createPayment(paymentData: any): Promise<any> {
  this.logger.log('=== CREATING PAYMENT ===');

  try {
    // Generate required custom_order_id
    const customOrderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // 1. Create Order - EXACT schema match
    const order = new this.orderModel({
      school_id: '65b0e6293e9f76a9694d84b4',
      trustee_id: '65b0e552dd31950a9b41c5ba',
      student_info: paymentData.student_info,
      gateway_name: 'PhonePe', // Must match enum exactly
      custom_order_id: customOrderId, // REQUIRED by your schema
      order_amount: parseFloat(paymentData.order_amount || paymentData.amount),
      status: 'pending'
    });

    const savedOrder = await order.save();
    this.logger.log(`Order saved: ${savedOrder._id}`);

    // 2. Create OrderStatus - ALL required fields
    const orderStatus = new this.orderStatusModel({
      collect_id: savedOrder._id,
      order_amount: parseFloat(paymentData.order_amount || paymentData.amount),
      transaction_amount: parseFloat(paymentData.order_amount || paymentData.amount),
      payment_mode: 'upi', // Must match enum: 'upi', 'card', 'netbanking', 'wallet', 'cash'
      payment_details: 'Payment initiated', // REQUIRED
      bank_reference: `REF_${Date.now()}`, // REQUIRED
      payment_message: 'Payment request created', // REQUIRED
      status: 'pending', // Must match enum
      error_message: 'NA',
      payment_time: new Date(),
      gateway: 'PhonePe', // REQUIRED - must match enum
      custom_order_id: customOrderId // REQUIRED
    });

    await orderStatus.save();
    this.logger.log('OrderStatus created');

    // 3. Try real API
    const jwtPayload = {
      school_id: '65b0e6293e9f76a9694d84b4',
      amount: (paymentData.order_amount || paymentData.amount).toString(),
      callback_url: paymentData.callback_url || 'http://localhost:3001/payment/callback'
    };

    const jwtSign = this.createJWTSignature(jwtPayload);

    try {
      const response = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        {
          school_id: '65b0e6293e9f76a9694d84b4',
          amount: (paymentData.order_amount || paymentData.amount).toString(),
          callback_url: paymentData.callback_url || 'http://localhost:3001/payment/callback',
          sign: jwtSign
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0'
          },
          timeout: 15000
        }
      );

      this.logger.log('Real API success:', response.data);

      // 4. Store collect_request_id in a separate collection or field
      // Since your schema doesn't have collect_request_id, store it differently
      savedOrder.set('collect_request_id', response.data.collect_request_id, { strict: false });
      await savedOrder.save();

      this.logger.log('Collect request ID stored:', response.data.collect_request_id);

      return {
        success: true,
        order_id: savedOrder._id.toString(),
        custom_order_id: savedOrder.custom_order_id,
        collect_request_id: response.data.collect_request_id,
        payment_url: response.data.Collect_request_url,
        message: 'Real payment created!'
      };

    } catch (apiError) {
      // Simulation fallback
      const simulatedId = `SIM_${savedOrder._id}`;
      
      savedOrder.set('collect_request_id', simulatedId, { strict: false });
      await savedOrder.save();

      return {
        success: true,
        order_id: savedOrder._id.toString(),
        custom_order_id: savedOrder.custom_order_id,
        collect_request_id: simulatedId,
        payment_url: `http://localhost:3001/simulate/${simulatedId}`,
        message: 'Simulation payment created'
      };
    }

  } catch (error) {
    this.logger.error('Payment creation failed:', error.message);
    throw new HttpException('Payment creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

// Update status check to use the stored field
async checkPaymentStatus(collectRequestId: string, schoolId?: string): Promise<any> {
  this.logger.log(`Checking status for: ${collectRequestId}`);

  try {
    // Build query - include schoolId if provided
    const query: any = { collect_request_id: collectRequestId };
    if (schoolId) {
      query.school_id = schoolId;
    }

    const order = await this.orderModel.findOne(query);

    if (!order) {
      const allOrders = await this.orderModel.find({}).limit(5);
      return {
        success: false,
        message: `No request found with code ${collectRequestId}`,
        available_orders: allOrders.length
      };
    }

    const orderStatus = await this.orderStatusModel.findOne({ 
      collect_id: order._id 
    });

    return {
      success: true,
      status: orderStatus?.status || 'pending',
      amount: order.order_amount,
      collect_request_id: collectRequestId
    };

  } catch (error) {
    this.logger.error('Status check failed:', error.message);
    throw new HttpException('Status check failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  // Other methods...
  async getAllPayments(): Promise<any> {
    try {
      const orders = await this.orderModel.find({}).sort({ created_at: -1 }).limit(10);
      return {
        success: true,
        orders_count: orders.length,
        orders: orders,
        collect_request_ids: orders.map(o => o.collect_request_id).filter(Boolean)
      };
    } catch (error) {
      throw new HttpException('Failed to get payments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTestPayment(): Promise<any> {
    const testData = {
      order_amount: 100,
      student_info: {
        name: 'Test Student',
        id: 'TEST001',
        email: 'test@example.com'
      },
      gateway_name: 'PhonePe',
      callback_url: 'http://localhost:3001/payment/callback'
    };

    return this.createPayment(testData);
  }

  async getHealth(): Promise<any> {
    const orderCount = await this.orderModel.countDocuments({});
    return {
      success: true,
      status: 'healthy',
      total_orders: orderCount
    };
  }

  async getAllTransactions(): Promise<any> {
    const orders = await this.orderModel.find({}).sort({ created_at: -1 });
    return {
      success: true,
      orders: orders
    };
  }

  async getTransactionsBySchool(schoolId: string): Promise<any> {
    const orders = await this.orderModel.find({ school_id: schoolId });
    return {
      success: true,
      transactions: orders
    };
  }

  async handleWebhook(webhookData: any): Promise<any> {
    // Implementation for webhook handling
    return { success: true };
  }
}