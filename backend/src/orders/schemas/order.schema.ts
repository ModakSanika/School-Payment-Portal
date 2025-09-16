import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ 
  collection: 'orders',
  timestamps: true,
  versionKey: false 
})
export class Order {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ 
    type: String, 
    required: true,
    index: true 
  })
  school_id: string;

  @Prop({ 
    type: String, 
    required: true,
    index: true 
  })
  trustee_id: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      id: { type: String, required: true },
      email: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
      }
    },
    required: true,
    _id: false
  })
  student_info: {
    name: string;
    id: string;
    email: string;
  };

  @Prop({ 
    type: String, 
    required: true,
    enum: ['PhonePe', 'Paytm', 'Razorpay', 'UPI', 'NetBanking', 'Card'],
    index: true
  })
  gateway_name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true
  })
  custom_order_id: string;

  @Prop({
    type: Number,
    required: true,
    min: 1
  })
  order_amount: number;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  })
  status: string;

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

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes for better performance
OrderSchema.index({ school_id: 1, status: 1 });
OrderSchema.index({ custom_order_id: 1 }, { unique: true });
OrderSchema.index({ 'student_info.email': 1 });
OrderSchema.index({ created_at: -1 });

// Pre-save middleware to update timestamp
OrderSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});