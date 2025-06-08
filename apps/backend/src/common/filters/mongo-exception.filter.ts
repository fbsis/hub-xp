import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle specific MongoDB errors
    if (exception.code) {
      switch (exception.code) {
        case 11000: // Duplicate key error
          status = HttpStatus.CONFLICT;
          message = this.extractDuplicateFieldMessage(exception);
          break;
        case 121: // Document validation failed
          status = HttpStatus.BAD_REQUEST;
          message = 'Document validation failed';
          break;
        default:
          message = exception.message || 'Database operation failed';
      }
    } else {
      message = exception.message || 'Database operation failed';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      error: this.getErrorName(exception.code)
    });
  }

  private extractDuplicateFieldMessage(exception: any): string {
    const match = exception.message.match(/index: (.+?)_/);
    const field = match ? match[1] : 'field';
    return `Duplicate value for ${field}`;
  }

  private getErrorName(code?: number): string {
    switch (code) {
      case 11000:
        return 'Duplicate Key Error';
      case 121:
        return 'Document Validation Error';
      default:
        return 'Database Error';
    }
  }
} 