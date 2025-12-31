import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs';

Injectable();
export class TimeoutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    // Different Timeouts for different operations
    let timeoutMs = 30000; // 30 seconds default

    //Shorter timeout for health checks
    if (url.includes('/health')) {
      timeoutMs = 5000; // 5 seconds
    }

    // Longer timeout for file uploads
    if (
      method === 'POST' &&
      (url.includes('/upload') || url.includes('/file'))
    ) {
      timeoutMs = 120000; // 2 minutes
    }

    // Longer timeout for complex operations
    if (url.includes('/sync') || url.includes('/bulk')) {
      timeoutMs = 60000; // 1 minute
    }

    return next.handle().pipe(
      timeout(timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          const logger = require('@nestjs/common').Logger;
          const log = new logger('Timeout');
          log.warn(`Request timeout after ${timeoutMs}ms: ${method} ${url}`);

          return throwError(
            () =>
              new RequestTimeoutException(
                `Request timeout after ${timeoutMs / 1000} seconds`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
