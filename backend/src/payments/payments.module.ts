// backend/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

// Import your existing schemas
// FIXED - Import both from same line:
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from '../orders/schemas/order-status.schema';

// Payment-related files
import { PaymentsController } from './payments.controller';

import { PaymentService } from './payments.service';

@Module({
  imports: [
    // Configuration module
    ConfigModule,
    
    // HTTP module for external API calls to Edviron
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 30000,
        maxRedirects: 5,
      }),
    }),
    
    // Mongoose schemas for payments
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService], // Export if other modules need to use it
})
export class PaymentsModule {}