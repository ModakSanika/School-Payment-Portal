import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto, PaymentResponseDto } from './dto/payment.dto';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    try {
      // First create an order
      const order = await this.ordersService.createOrder(createPaymentDto);

      // Prepare payload for payment gateway
      const paymentPayload = {
        school_id: createPaymentDto.school_id,
        trustee_id: createPaymentDto.trustee_id,
        custom_order_id: order.custom_order_id,
        order_amount: createPaymentDto.order_amount,
        student_info: createPaymentDto.student_info,
        gateway_name: createPaymentDto.gateway_name,
        success_url: `${this.configService.get('FRONTEND_URL')}/payment/success`,
        failure_url: `${this.configService.get('FRONTEND_URL')}/payment/failure`,
        webhook_url: `${this.configService.get('BACKEND_URL') || 'http://localhost:3000'}/api/v1/webhook`,
      };

      // Generate JWT signed payload
      const jwtToken = this.generateJWTPayload(paymentPayload);

      // Make API call to payment gateway
      const paymentResponse = await this.callPaymentGateway(jwtToken, paymentPayload);

      this.logger.log(`Payment created successfully for order: ${order.custom_order_id}`);

      return {
        custom_order_id: order.custom_order_id,
        payment_url: paymentResponse.payment_url,
        status: 'success',
        message: 'Payment request created successfully',
        order_amount: createPaymentDto.order_amount,
        gateway: createPaymentDto.gateway_name,
      };

    } catch (error) {
      this.logger.error(`Payment creation failed: ${error.message}`, error.stack);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create payment request');
    }
  }

  private generateJWTPayload(payload: any): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    
    const jwtPayload = {
      ...payload,
      pg_key: this.configService.get<string>('PG_KEY'),
      timestamp: Date.now(),
    };

    return jwt.sign(jwtPayload, secret, { expiresIn: '1h' });
  }

  private async callPaymentGateway(jwtToken: string, payload: any) {
    try {
      // This is a mock implementation since we don't have the actual payment gateway URL
      // In real implementation, you would call the actual payment gateway API
      
      const paymentGatewayUrl = this.configService.get<string>('PAYMENT_API_BASE_URL');
      const apiKey = this.configService.get<string>('API_KEY');

      // Mock response for development
      if (!paymentGatewayUrl || paymentGatewayUrl === 'https://api.paymentgateway.com') {
        this.logger.warn('Using mock payment gateway response for development');
        
        return {
          payment_url: `https://mock-payment-gateway.com/pay/${payload.custom_order_id}`,
          status: 'success',
          message: 'Payment URL generated successfully',
          transaction_id: `TXN_${Date.now()}`,
        };
      }

      // Actual API call (uncomment when you have real payment gateway)
      /*
      const response = await axios.post(
        `${paymentGatewayUrl}/create-collect-request`,
        {
          jwt_token: jwtToken,
          ...payload,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (response.status !== 200) {
        throw new BadRequestException('Payment gateway returned error');
      }

      return response.data;
      */

      // For now, return mock response
      return {
        payment_url: `https://mock-payment-gateway.com/pay/${payload.custom_order_id}`,
        status: 'success',
        message: 'Payment URL generated successfully',
        transaction_id: `TXN_${Date.now()}`,
      };

    } catch (error) {
      this.logger.error('Payment gateway API call failed:', error.message);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new BadRequestException(
            `Payment gateway error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
          );
        } else if (error.request) {
          throw new InternalServerErrorException('Payment gateway is not reachable');
        }
      }
      
      throw new InternalServerErrorException('Payment gateway integration failed');
    }
  }

  async getPaymentStatus(customOrderId: string) {
    try {
      const transactionStatus = await this.ordersService.getTransactionStatus(customOrderId);
      return transactionStatus;
    } catch (error) {
      throw error;
    }
  }
}