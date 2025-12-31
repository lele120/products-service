import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { ERROR_MESSAGES } from '../../constants';

@Catch(UniqueConstraintError, ValidationError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    let errorType: string = ERROR_MESSAGES.DATABASE_ERROR;

    // Handle specific unique constraint violations (e.g., existing email or token)
    if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.CONFLICT;
      message = exception.errors.map((e) => e.message).join(', ');
      errorType = ERROR_MESSAGES.CONFLICT;
    }
    // Handle Sequelize model validation errors
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.errors.map((e) => e.message).join(', ');
      errorType = ERROR_MESSAGES.VALIDATION_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorType,
      message: message,
    });
  }
}
