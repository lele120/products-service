import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const isProduction = process.env.NODE_ENV === 'production';

    const transports: winston.transport[] = [
      // Console transport for development
      new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.colorize(),
          winston.format.printf((info: any) => {
            const { timestamp, level, message, context, stack } = info;
            let log = `${String(timestamp)} [${String(level).toUpperCase()}]`;
            if (context) log += ` [${String(context)}]`;
            log += `: ${String(message)}`;
            if (stack) log += `\n${String(stack)}`;
            return log;
          }),
        ),
      }),
    ];

    // Add file transport for production
    if (isProduction) {
      transports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
        // Separate error log file
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports,
      // Handle uncaught exceptions
      exceptionHandlers: isProduction
        ? [
            new DailyRotateFile({
              filename: 'logs/exceptions-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
            }),
          ]
        : undefined,
      // Handle unhandled promise rejections
      rejectionHandlers: isProduction
        ? [
            new DailyRotateFile({
              filename: 'logs/rejections-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
            }),
          ]
        : undefined,
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, meta?: any, context?: string) {
    this.logger.error(message, { ...meta, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Additional utility methods
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: string,
  ) {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this.logger.log(level, `${method} ${url} ${statusCode} - ${duration}ms`, {
      context,
    });
  }

  logDatabase(
    operation: string,
    table: string,
    duration?: number,
    context?: string,
  ) {
    const message = `DB ${operation} on ${table}${duration ? ` (${duration}ms)` : ''}`;
    this.logger.debug(message, { context });
  }

  logBusiness(operation: string, details?: any, context?: string) {
    this.logger.info(`Business: ${operation}`, { ...details, context });
  }
}
