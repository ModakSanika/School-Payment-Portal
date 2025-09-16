import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookLog, WebhookLogDocument } from './schemas/webhook-logs.schema';
import { OrderStatus, OrderStatusDocument } from '../orders/schemas/order-status.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { WebhookPayloadDto, WebhookResponseDto } from './dto/webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async processWebhook(
    webhookPayload: WebhookPayloadDto,
    headers: Record<string, any>,
    sourceIp: string
  ): Promise<WebhookResponseDto> {
    const webhookId = this.generateWebhookId();
    
    try {
      this.logger.log(`Processing webhook for order: ${webhookPayload.order_info.order_id}`);

      // Log the webhook
      const webhookLog = await this.logWebhook({
        webhook_id: webhookId,
        event_type: this.determineEventType(webhookPayload.order_info.status),
        order_id: webhookPayload.order_info.order_id,
        payload: webhookPayload,
        status_code: webhookPayload.status,
        received_at: new Date(),
        source_ip: sourceIp,
        headers,
        processing_status: 'received'
      });

      // Update processing status
      webhookLog.processing_status = 'processing';
      await webhookLog.save();

      // Find the order by custom_order_id
      const order = await this.orderModel.findOne({ 
        custom_order_id: webhookPayload.order_info.order_id 
      });

      if (!order) {
        const errorMessage = `Order not found: ${webhookPayload.order_info.order_id}`;
        await this.updateWebhookLog(webhookLog, 'failed', errorMessage);
        throw new NotFoundException(errorMessage);
      }

      // Update or create order status
      await this.updateOrderStatus(order, webhookPayload.order_info);

      // Update order status if needed
      if (order.status !== webhookPayload.order_info.status) {
        order.status = webhookPayload.order_info.status;
        await order.save();
      }

      // Update webhook log as processed
      await this.updateWebhookLog(webhookLog, 'processed', 'Webhook processed successfully');

      this.logger.log(`Webhook processed successfully for order: ${webhookPayload.order_info.order_id}`);

      return {
        success: true,
        message: 'Webhook processed successfully',
        order_id: webhookPayload.order_info.order_id,
        status: webhookPayload.order_info.status
      };

    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`, error.stack);
      
      // Try to update webhook log if it exists
      try {
        const failedLog = await this.webhookLogModel.findOne({ webhook_id: webhookId });
        if (failedLog) {
          await this.updateWebhookLog(failedLog, 'failed', error.message);
        }
      } catch (logError) {
        this.logger.error('Failed to update webhook log:', logError.message);
      }

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to process webhook');
    }
  }

  private async updateOrderStatus(order: Order, orderInfo: any) {
    try {
      // Check if order status already exists
      let orderStatus = await this.orderStatusModel.findOne({ collect_id: order._id });

      const statusData = {
        collect_id: order._id,
        order_amount: orderInfo.order_amount,
        transaction_amount: orderInfo.transaction_amount,
        payment_mode: orderInfo.payment_mode,
        payment_details: orderInfo.payemnt_details, // Note: keeping the typo from spec
        bank_reference: orderInfo.bank_reference,
        payment_message: orderInfo.Payment_message, // Note: keeping the capital P from spec
        status: orderInfo.status,
        error_message: orderInfo.error_message || 'NA',
        payment_time: new Date(orderInfo.payment_time),
        gateway: orderInfo.gateway,
        custom_order_id: orderInfo.order_id
      };

      if (orderStatus) {
        // Update existing order status
        Object.assign(orderStatus, statusData);
        await orderStatus.save();
        this.logger.log(`Updated existing order status for: ${orderInfo.order_id}`);
      } else {
        // Create new order status
        orderStatus = new this.orderStatusModel(statusData);
        await orderStatus.save();
        this.logger.log(`Created new order status for: ${orderInfo.order_id}`);
      }

      return orderStatus;
    } catch (error) {
      this.logger.error(`Failed to update order status: ${error.message}`);
      throw new BadRequestException('Failed to update order status');
    }
  }

  private async logWebhook(webhookData: any): Promise<WebhookLogDocument> {
    const webhookLog = new this.webhookLogModel(webhookData);
    return webhookLog.save();
  }

  private async updateWebhookLog(
    webhookLog: WebhookLogDocument, 
    status: string, 
    message: string
  ): Promise<void> {
    webhookLog.processing_status = status;
    if (status === 'failed') {
      webhookLog.error_message = message;
    } else {
      webhookLog.response_message = message;
    }
    await webhookLog.save();
  }

  private determineEventType(status: string): string {
    switch (status.toLowerCase()) {
      case 'success':
        return 'payment_success';
      case 'failed':
        return 'payment_failed';
      case 'pending':
        return 'payment_pending';
      default:
        return 'payment_status_update';
    }
  }

  private generateWebhookId(): string {
    return `WHK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get webhook logs for debugging
  async getWebhookLogs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      this.webhookLogModel
        .find()
        .sort({ received_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.webhookLogModel.countDocuments()
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get webhook logs by order ID
  async getWebhookLogsByOrderId(orderId: string) {
    return this.webhookLogModel
      .find({ order_id: orderId })
      .sort({ received_at: -1 })
      .exec();
  }
}