import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T = any> {
  @ApiProperty({
    example: true,
    description: 'Indicates if the operation was successful',
  })
  success: boolean;

  @ApiProperty({
    required: false,
    description: 'Response data (only present on success',
  })
  data?: T;

  @ApiProperty({ 
    required: false,
    example: 'Operation completed successfully',
    description: 'Human-readable success message'
  })
  message?: string;

  @ApiProperty({ 
    example: '2024-01-20T10:30:00.000Z',
    description: 'ISO timestamp of the response'
  })
  timestamp: string;

  @ApiProperty({ 
    required: false,
    description: 'Request ID for tracing (optional)' 
  })
  requestId?: string;
}

export class PaginatedResponse<T> extends ApiResponse<T[]> {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Whether there are more pages' })
  hasNext: boolean;

  @ApiProperty({ example: false, description: 'Whether there are previous pages',})
  hasPrev: boolean;
}

export class ErrorResponse extends ApiResponse {
    @ApiProperty({ 
        example: 400,
        enum: HttpStatus,
        description: 'HTTP status code'
      })
      statusCode: number;
    
      @ApiProperty({ 
        example: 'VALIDATION_ERROR',
        description: 'Machine-readable error code'
      })
      errorCode: string;
    
      @ApiProperty({ 
        required: false,
        description: 'Detailed error information'
      })
      details?: Record<string, any>;
    
      @ApiProperty({ 
        required: false,
        description: 'Path to the field that caused the error'
      })
      path?: string;
}

// Common error codes 
export enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
