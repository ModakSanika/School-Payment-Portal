import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookLog, WebhookLogSchema } from './schemas/webhook-logs.schema';
import { OrderStatus, OrderStatusSchema } from '../orders/schemas/order-status.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebhookLog.name, schema: WebhookLogSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: Order.name, schema: OrderSchema }
    ]),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}