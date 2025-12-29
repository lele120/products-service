import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';

@Catch(UniqueConstraintError, ValidationError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Errore interno del server';
    let errorType = 'DatabaseError';

    // Gestione specifica per violazione di unicità (es. email o token già esistenti)
    if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.CONFLICT;
      message = exception.errors.map((e) => e.message).join(', ');
      errorType = 'Conflict';
    }
    // Gestione per errori di validazione del modello Sequelize
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.errors.map((e) => e.message).join(', ');
      errorType = 'ValidationError';
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
