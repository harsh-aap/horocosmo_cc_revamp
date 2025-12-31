import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from '../../infrastructure/monitoring/monitoring.service';
import { response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, user } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    // Log incoming request
    this.logger.debug(
      `[${method}] ${url} - IP: ${ip} - User: ${user?.id || 'anonymous'} - Start`,
    );

    return next.handle().pipe(
      tap({
        next: (response) => {
          const { statusCode } = context.switchToHttp().getRequest();
          const duration = Date.now() - startTime;

          this.monitoringService.recordHttpRequest(
            method,
            url,
            statusCode,
            duration,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.warn(
            `[${method}] ${url} - ${statusCode} - ${duration}ms - Error: ${error.message}`,
          );
          this.monitoringService.recordHttpRequest(
            method,
            url,
            statusCode,
            duration,
          );
        },
      }),
    );
  }
}
