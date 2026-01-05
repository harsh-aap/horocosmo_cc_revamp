import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncUserUseCase } from '../application/usecaes/sync-user.usecase';
import { SyncUserRequestDto } from './dto/sync-user-request.dto';
import { UserType } from 'src/infrastructure/database/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly syncUserUseCase: SyncUserUseCase) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync user from external backend',
    description: 'Synchronizes user data from the main horoscope backend. Creates new user if not exists, updates existing user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User synchronized successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
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
        message: { type: 'string', example: 'User synchronized successfully' },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/api/v2/users/sync' },
        method: { type: 'string', example: 'POST' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async syncUser(@Body() request: SyncUserRequestDto) {
    const user = await this.syncUserUseCase.execute({
      externalId: request.externalId,
      name: request.name,
      email: request.email,
      type: request.type as UserType,
      phone: request.phone,
    });

    return {
      success: true,
      data: user,
      message: 'User synchronized successfully',
    };
  }
}