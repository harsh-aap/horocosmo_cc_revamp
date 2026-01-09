import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncUserUseCase } from '../application/usecaes/sync-user.usecase';
import { SyncUserRequestDto } from './dto/sync-user-request.dto';
import { UserType } from 'src/infrastructure/database/entities/user.entity';

/**
 * UserController
 *
 * Handles HTTP requests related to user operations.
 * This controller is part of the Presentation Layer in a layered architecture.
 */
@ApiTags('Users') // Swagger tag for grouping endpoints in API docs
@Controller('users') // Base path for all routes in this controller
export class UserController {
  constructor(private readonly syncUserUseCase: SyncUserUseCase) {}
  // Inject the SyncUserUseCase to handle business logic

  /**
   * Sync user endpoint
   *
   * This endpoint synchronizes user data from an external system.
   * If the user exists, it updates their profile; otherwise, it creates a new user.
   */
  @Post('sync') // HTTP POST endpoint at /users/sync
  @HttpCode(HttpStatus.OK) // Returns 200 OK even for creation (instead of 201)
  @ApiOperation({
    summary: 'Sync user from external backend',
    description:
      'Synchronizes user data from the main horoscope backend. Creates new user if not exists, updates existing user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User synchronized successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }, // Indicates request success
        data: {
          type: 'object', // User object returned
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            type: { type: 'string', enum: ['user', 'astrologer'], example: 'user' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'], example: 'active' },
            sync_status: { type: 'string', enum: ['synced', 'pending', 'failed'], example: 'synced' },
            last_sync_at: { type: 'string', format: 'date-time' },
            phone: { type: 'string', example: '+1234567890', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string', example: 'User synchronized successfully' }, // Human-readable status message
        timestamp: { type: 'string', format: 'date-time' }, // Request timestamp
        path: { type: 'string', example: '/api/v2/users/sync' }, // Request path
        method: { type: 'string', example: 'POST' }, // HTTP method
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data', // Swagger docs for 400 error
  })
  async syncUser(@Body() request: SyncUserRequestDto) {
    // Map incoming DTO to the use case input
    const user = await this.syncUserUseCase.execute({
      externalId: request.externalId,
      name: request.name,
      email: request.email,
      type: request.type as UserType,
      phone: request.phone,
    });

    // Return a structured API response
    return {
      success: true,
      data: user,
      message: 'User synchronized successfully',
    };
  }
}

