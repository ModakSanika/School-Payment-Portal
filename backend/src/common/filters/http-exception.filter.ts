import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse
      ? exception.getResponse()
      : 'Internal server error';

    const errorMessage =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || 'Internal server error';

    const errorDetails =
      typeof errorResponse === 'object' ? errorResponse : null;

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: errorMessage,
        details: errorDetails,
      }),
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
      ...(errorDetails && { details: errorDetails }),
    });
  }
}