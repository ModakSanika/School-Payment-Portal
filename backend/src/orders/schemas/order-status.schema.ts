import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ 
  collection: 'order_status',
  timestamps: true,
  versionKey: false 
})
export class OrderStatus {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Order',
    required: true,
    index: true
  })
  collect_id: Types.ObjectId;

  @Prop({ 
    type: Number, 
    required: true,
    min: 0
  })
  order_amount: number;

  @Prop({ 
    type: Number, 
    required: true,
    min: 0
  })
  transaction_amount: number;

  @Prop({ 
    type: String, 
    required: true,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'cash'],
    lowercase: true
  })
  payment_mode: string;

  @Prop({ 
    type: String, 
    required: true 
  })
  payment_details: string;

  @Prop({ 
    type: String, 
    required: true,
    index: true
  })
  bank_reference: string;

  @Prop({ 
    type: String, 
    required: true 
  })
  payment_message: string;

  @Prop({ 
    type: String, 
    required: true,
    enum: ['pending', 'success', 'failed', 'processing', 'cancelled'],
    lowercase: true,
    index: true
  })
  status: string;

  @Prop({ 
    type: String,
    default: 'NA'
  })
  error_message: string;

  @Prop({ 
    type: Date, 
    required: true,
    index: true
  })
  payment_time: Date;

  @Prop({
    type: String,
    enum: ['PhonePe', 'Paytm', 'Razorpay', 'UPI', 'NetBanking', 'Card'],
    required: true
  })
  gateway: string;

  @Prop({
    type: String,
    required: true,
    index: true
  })
  custom_order_id: string;

  @Prop({
    type: Date,
    default: Date.now
  })
  created_at: Date;

  @Prop({
    type: Date,
    default: Date.now
  })
  updated_at: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

// Indexes for better performance
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ status: 1, payment_time: -1 });
OrderStatusSchema.index({ bank_reference: 1 }, { unique: true });
OrderStatusSchema.index({ custom_order_id: 1 });
OrderStatusSchema.index({ gateway: 1, status: 1 });

// Pre-save middleware to update timestamp
OrderStatusSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});
