// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Your existing modules (keep only the ones that exist)
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';

// Your existing controllers and services
import { AppController } from './app.controller';
import { AppService } from './app.service';

// JWT Guard from auth module (assuming it exists there)
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),

    // JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: parseInt(configService.get<string>('RATE_LIMIT_WINDOW_MS')) || 900000,
          limit: parseInt(configService.get<string>('RATE_LIMIT_MAX_REQUESTS')) || 100,
        },
      ],
      inject: [ConfigService],
    }),

    // Your existing feature modules
    AuthModule,
    OrdersModule,
    PaymentsModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Temporarily comment out the global JWT guard to test without auth
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}