import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/database/entities/user.entity';
import { SYNC_USER_PORT } from './application/interfaces/sync-user.interface';
import { SyncUserUseCase } from './application/usecaes/sync-user.usecase';
import { SyncUserRepository } from './infrastructure/sync-user.repository';
import { UserController } from './presentation/sync-user.controller';
import { UserProfileRepository } from './infrastructure/user-profile.repository';
import { UserLookupRepository } from './infrastructure/user-lookup.repository';
import { USER_PROFILE_PORT } from './application/interfaces/user-profile.interface';
import { USER_LOOKUP_PORT } from './application/interfaces/user-lookup.interface';
import { GetActiveAstrologersUseCase } from './application/usecaes/get-active-astrologers.usecase';
import { GetUserProfileUseCase } from './application/usecaes/get-user.usecase';
import { UpdateUserProfileUseCase } from './application/usecaes/update-user-profile.usecase';

/**
 * UserModule
 *
 * This module encapsulates all user-related functionality, following
 * the layered architecture pattern:
 * 1. Presentation Layer: HTTP controller for API requests
 * 2. Application Layer: Business logic use cases
 * 3. Infrastructure Layer: Database persistence and external integrations
 */
@Module({
  imports: [
    // Register the TypeORM repository for the User entity
    // This allows dependency injection of the repository in services
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    // HTTP endpoints for user-related actions
    UserController,
  ],
  providers: [
    // 1. Repository implementation
    // Provides the database operations for users
    SyncUserRepository,
    UserProfileRepository,
    UserLookupRepository,

    // 2. Dependency Injection mapping
    // Map the SyncUserPort interface to the concrete UserRepository implementation
    {
      provide: SYNC_USER_PORT,
      useClass: SyncUserRepository,
    },
    {
      provide: USER_PROFILE_PORT,
      useClass: UserProfileRepository,
    },
    {
      provide: USER_LOOKUP_PORT,
      useClass: UserLookupRepository,
    },
    // 3. Use Cases
    // Business logic that orchestrates user creation/syncing
    SyncUserUseCase,
    GetActiveAstrologersUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
  ],
  exports: [
    // Export use cases for other modules to use
    SyncUserUseCase,
    GetActiveAstrologersUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
  ],
})
export class UserModule {}
