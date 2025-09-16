import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ 
  collection: 'webhook_logs',
  timestamps: true,
  versionKey: false 
})
export class WebhookLog {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ 
    type: String, 
    required: true,
    index: true
  })
  webhook_id: string;

  @Prop({ 
    type: String, 
    required: true,
    enum: ['payment_status_update', 'payment_success', 'payment_failed', 'payment_pending'],
    index: true
  })
  event_type: string;

  @Prop({ 
    type: String, 
    required: true,
    index: true
  })
  order_id: string;

  @Prop({ 
    type: Object, 
    required: true 
  })
  payload: Record<string, any>;

  @Prop({ 
    type: Number, 
    required: true,
    index: true
  })
  status_code: number;

  @Prop({ 
    type: String,
    enum: ['received', 'processing', 'processed', 'failed', 'ignored'],
    default: 'received',
    index: true
  })
  processing_status: string;

  @Prop({ 
    type: String 
  })
  error_message: string;

  @Prop({ 
    type: String 
  })
  response_message: string;

  @Prop({ 
    type: Date, 
    required: true,
    index: true
  })
  received_at: Date;

  @Prop({ 
    type: Date 
  })
  processed_at: Date;

  @Prop({
    type: String,
    required: true
  })
  source_ip: string;

  @Prop({
    type: Object
  })
  headers: Record<string, any>;

  @Prop({
    type: Number,
    default: 0
  })
  retry_count: number;

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

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);

// Indexes for better performance
WebhookLogSchema.index({ webhook_id: 1 }, { unique: true });
WebhookLogSchema.index({ event_type: 1, received_at: -1 });
WebhookLogSchema.index({ order_id: 1, status_code: 1 });
WebhookLogSchema.index({ processing_status: 1, received_at: -1 });
WebhookLogSchema.index({ received_at: -1 });

// Pre-save middleware to update timestamp
WebhookLogSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  
  // Set processed_at when processing_status changes to 'processed' or 'failed'
  if (this.isModified('processing_status') && 
      (this.processing_status === 'processed' || this.processing_status === 'failed')) {
    this.processed_at = new Date();
  }
  
  next();
});