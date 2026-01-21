import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { SyncUserUseCase } from '../application/usecaes/user-usecases/sync-user.usecase';
import { UpdateUserCoreDetailsUseCase } from '../application/usecaes/user-usecases/update-user-core-details.usecase';
import { GetActiveAstrologersUseCase } from '../application/usecaes/user-usecases/get-active-astrologers.usecase';
import { GetActiveUsersUseCase } from '../application/usecaes/user-usecases/get-active-users.usecase';
import { SyncUserRequestDto } from './dto/sync-user-request.dto';
import { UpdateUserCoreRequestDto } from './dto/update-user-core-details-request.dto';
import { UserType } from 'src/infrastructure/database/entities/user.entity';
import { GetUserUseCase } from '../application/usecaes/user-usecases/get-user.usecase';

/**
 * UserController
 *
 * Handles all HTTP requests related to user operations.
 * This controller is part of the Presentation Layer in a layered architecture.
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly syncUserUseCase: SyncUserUseCase,
    private readonly getUserProfileUseCase: GetUserUseCase, 
    private readonly updateUserCoreDetails: UpdateUserCoreDetailsUseCase,
    private readonly getActiveAstrologersUseCase: GetActiveAstrologersUseCase,
    private readonly getActiveUserUseCase: GetActiveUsersUseCase,
  ) { }

  /**
   * Sync user from external system
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync user from external backend',
    description: 'Synchronizes user data from the main horoscope backend.',
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
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', nullable: true },
            type: { type: 'string', enum: ['user', 'astrologer'] },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
            },
            phone: { type: 'string', nullable: true },
          },
        },
        message: { type: 'string', example: 'User synchronized successfully' },
      },
    },
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

  /**
   * Get user profile by ID
   */
  // previously @Get(':id/profile')
  @Get(':id')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves a user profile by their ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            type: { type: 'string', enum: ['user', 'astrologer'] },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
            },
          },
        },
        message: {
          type: 'string',
          example: 'User profile retrieved successfully',
        },
      },
    },
  })
  async getUserProfile(@Param('id') userId: string) {
    const user = await this.getUserProfileUseCase.execute(userId);
    return {
      success: true,
      data: user,
      message: 'User profile retrieved successfully',
    };
  }

  /**
   * Update user profile
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates a user profile with provided data.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
          },
        },
        message: {
          type: 'string',
          example: 'User profile updated successfully',
        },
      },
    },
  })
  async updateUserProfile(
    @Param('id') userId: string,
    @Body() request: UpdateUserCoreRequestDto,
  ) {
    const user = await this.updateUserCoreDetails.execute(userId, request);

    return {
      success: true,
      data: user,
      message: 'User profile updated successfully',
    };
  }

  /**
   * Get Active users
   */
  @Get('active')
  @ApiOperation({
    summary: 'Get active users',
    description: 'Retrieves a list of all active users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', nullable: true },
              phone: { type: 'string', nullable: true },
              completed_consultations: { type: 'number', example: 150 },
            },
          },
        },
        message: {
          type: 'string',
          example: 'Active users retrieved successfully',
        },
      },
    },
  })
  async getActiveUsers() {
    const users = await this.getActiveUserUseCase.execute();
    return {
      success: true,
      data: users,
      message: 'Active users retrieved successfully',
    };
  }
  /**
   * Get active astrologers
   */
  @Get('astrologers/active')
  @ApiOperation({
    summary: 'Get active astrologers',
    description: 'Retrieves a list of all active astrologers.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active astrologers retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', nullable: true },
              phone: { type: 'string', nullable: true },
              completed_consultations: { type: 'number', example: 150 },
              rating: { type: 'number', example: 4.8 },
            },
          },
        },
        message: {
          type: 'string',
          example: 'Active astrologers retrieved successfully',
        },
      },
    },
  })
  async getActiveAstrologers() {
    const astrologers = await this.getActiveAstrologersUseCase.execute();

    return {
      success: true,
      data: astrologers,
      message: 'Active astrologers retrieved successfully',
    };
  }
}
