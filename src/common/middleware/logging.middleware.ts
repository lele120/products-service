import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const start = Date.now();

    // Log request
    this.logger.debug(
      `Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent.substring(0, 100)}`,
    );

    // Log response
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const contentLength = res.get('Content-Length') || '0';

      // Use appropriate log level based on status code
      if (statusCode >= 400) {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${contentLength} bytes`,
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${contentLength} bytes`,
        );
      }
    });

    // Log errors
    res.on('error', (error) => {
      this.logger.error(
        `Response error for ${method} ${originalUrl}: ${error.message}`,
        error.stack,
      );
    });

    next();
  }
}
