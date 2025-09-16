import { Controller, Post, Get, Body, Headers, Ip, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { WebhookPayloadDto, WebhookResponseDto } from './dto/webhook.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Handle payment webhook from payment gateway' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid webhook payload',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async handleWebhook(
    @Body() webhookPayload: WebhookPayloadDto,
    @Headers() headers: Record<string, any>,
    @Ip() sourceIp: string,
  ): Promise<WebhookResponseDto> {
    return this.webhooksService.processWebhook(webhookPayload, headers, sourceIp);
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get webhook logs (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Webhook logs retrieved successfully',
  })
  async getWebhookLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.webhooksService.getWebhookLogs(page, limit);
  }

  @Get('logs/:orderId')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'school_admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get webhook logs by order ID' })
  @ApiResponse({
    status: 200,
    description: 'Webhook logs for order retrieved successfully',
  })
  async getWebhookLogsByOrderId(@Query('orderId') orderId: string) {
    return this.webhooksService.getWebhookLogsByOrderId(orderId);
  }
}