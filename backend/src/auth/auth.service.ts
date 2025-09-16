import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto, RegisterDto, AuthResponseDto, JwtPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, role = 'user', school_id } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate school_id for school_admin role
    if (role === 'school_admin' && !school_id) {
      throw new BadRequestException('School ID is required for school_admin role');
    }

    try {
      // Create new user
      const user = new this.userModel({
        email,
        password, // This will be hashed by the pre-save middleware
        firstName,
        lastName,
        role,
        ...(school_id && { school_id }),
      });

      const savedUser = await user.save();

      // Generate JWT token
      const payload: JwtPayload = {
sub: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        ...(savedUser.school_id && { school_id: savedUser.school_id }),
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        token_type: 'Bearer',
        expires_in: this.configService.get<string>('JWT_EXPIRATION'),
        user: {
          id: savedUser._id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          ...(savedUser.school_id && { school_id: savedUser.school_id}),
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      ...(user.school_id && { school_id: user.school_id }),
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: this.configService.get<string>('JWT_EXPIRATION'),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...(user.school_id && { school_id: user.school_id }),
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    return user;
  }

  async getProfile(userId: string): Promise<User> {
    return this.validateUser(userId);
  }
}