import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ 
  collection: 'users',
  timestamps: true,
  versionKey: false 
})
export class User {
  @Prop({ 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  })
  email: string;

  @Prop({ 
    type: String, 
    required: true,
    minlength: 6
  })
  password: string;

  @Prop({ 
    type: String, 
    required: true,
    trim: true
  })
  firstName: string;

  @Prop({ 
    type: String, 
    required: true,
    trim: true
  })
  lastName: string;

  @Prop({ 
    type: String,
    enum: ['admin', 'school_admin', 'user'],
    default: 'user'
  })
  role: string;

  @Prop({ 
    type: String,
    required: false
  })
  school_id: string;

  @Prop({
    type: Boolean,
    default: true
  })
  isActive: boolean;

  @Prop({
    type: Date,
    default: Date.now
  })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for email
UserSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to validate password
UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Transform output to remove password
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};