/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      // Determine message
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message || 'Error';
      // Determine error type
      error =
        typeof res === 'object' && (res as any).error
          ? (res as any).error
          : exception.name || 'Error';
    } else {
      message = 'Internal server error';
      error = 'InternalServerError';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
    });
  }
}
