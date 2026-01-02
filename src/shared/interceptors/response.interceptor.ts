import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> | Promise<Observable<ApiResponse<T>>> {
    const request = context.switchToHttp().getRequest();
    const requestId =
      request.headers['x-request-id'] || this.generateRequestId();
    return next.handle().pipe(
      map((data: any) => {
        // if already formatted as ApiResponse, return as-in
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString(),
            requestId,
          };
        }
        // format as success response
        return {
          success: true,
          data,
          message: this.getSuccessMessage(context),
          timestamp: new Date().toISOString(),
          requestId,
        };
      }),
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private getSuccessMessage(context: ExecutionContext): string {
    const handler = context.getHandler();

    // Default success messages based on HTTP method
    const method = context.switchToHttp().getRequest().method;
    switch(method){
        case 'GET':
            return 'Data retrived successfully';
        case 'POST':
            return 'Resource created successfully';
        case 'PUT':
        case 'PATCH':
            return 'Resource updated Successfully';
        case 'DELETE':
            return 'Resource deletd Successfully';
        default:
            return 'Operation completed successfully'
    }
  }
}
