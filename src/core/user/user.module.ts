import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entity
import { User } from 'src/infrastructure/database/entities/user.entity';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';

//Interfaces
import { SYNC_USER_PORT } from './application/interfaces/user/sync-user.interface';
import { USER_MANAGEMENT_PORT } from './application/interfaces/user/user-management.interface';
import { USER_QUERY_PORT } from './application/interfaces/user/user-query.interface';
import { USER_PROFILE_MANAGEMENT_PORT } from './application/interfaces/user-profile/user-profile-management.interface';
import { USER_PROFILE_QUERY_PORT } from './application/interfaces/user-profile/user-profile-query.interface';
import { ASTROLOGER_PROFILE_MANAGEMENT_PORT } from './application/interfaces/user-astrologer/astrologer-profile-management.interface';
import { ASTROLOGER_PROFILE_QUERY_PORT } from './application/interfaces/user-astrologer/astrologer-profile-query.interface';

// Usecases
import { SyncUserUseCase } from './application/usecaes/user-usecases/sync-user.usecase';
import { GetActiveAstrologersUseCase } from './application/usecaes/user-usecases/get-active-astrologers.usecase';
import { GetActiveUsersUseCase } from './application/usecaes/user-usecases/get-active-users.usecase';
import { GetUserProfileUseCase } from './application/usecaes/user-usecases/get-user.usecase';
import { UpdateUserCoreDetailsUseCase } from './application/usecaes/user-usecases/update-user-core-details.usecase';
import { UpdateUserProfileUseCase } from './application/usecaes/user-profile-usecases/update-user-profile.usecase';

// Repositories
import { SyncUserRepository } from './infrastructure/user/sync-user.repository';
import { UserQueryRepository } from './infrastructure/user/user-query.repository';
import { UserProfileBaseRepository } from './infrastructure/user-profile/base-user-profile.repository';
import { UserProfileManagementRepository } from './infrastructure/user-profile/user-profile-management.repository';
import { UserProfileQueryRepository } from './infrastructure/user-profile/user-profile-query.repository';
import { UserManagementRepository } from './infrastructure/user/user-management.repository';
import { AstrologerProfileManagementRepository } from './infrastructure/astrologer-profile/astrologer-profile-management.repository';
import { AstrologerProfileQueryRepository } from './infrastructure/astrologer-profile/astrologer-profile-query.repository';

// Controllers
import { UserController } from './presentation/user.controller';
import { UserProfileController } from './presentation/user-profile.controller';
import { AstrologerProfileBaseRepository } from './infrastructure/astrologer-profile/astrologer-profile-base.repository';
import { BaseUserRepository } from './infrastructure/user/base-user.repository';
import { CreateUserProfileUseCase } from './application/usecaes/user-profile-usecases/create-user-profile.usecase';
import { AddUserRatingUseCase } from './application/usecaes/user-profile-usecases/add-user-rating.usecase';
import { UpdateUserProfileStatsUseCase } from './application/usecaes/user-profile-usecases/update-user-profile-stats.usecase';
import { GetUserProfileStatsUseCase } from './application/usecaes/user-profile-usecases/get-user-profile-stats.usecase';
import { GetTopRatedAstrologersUseCase } from './application/usecaes/astrologer-profile-usecases/get-top-rated-astrologers.usecase';
import { GetTopRatedUserProfilesUseCase } from './application/usecaes/user-profile-usecases/get-top-rated-user-profiles.usecase';

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
    TypeOrmModule.forFeature([User, UserProfile, AstrologerProfile]),
  ],
  controllers: [
    // HTTP endpoints for user-related actions
    UserController,
    UserProfileController
  ],
  providers: [
    // 1. Repository implementation
    // Provides the database operations for users
    BaseUserRepository,
    SyncUserRepository,
    UserManagementRepository,
    UserQueryRepository,
    UserProfileBaseRepository,
    UserProfileManagementRepository,
    UserProfileQueryRepository,
    AstrologerProfileBaseRepository,
    AstrologerProfileManagementRepository,
    AstrologerProfileQueryRepository,
    // 2. Dependency Injection mapping
    // Map the SyncUserPort interface to the concrete UserRepository implementation
    {
      provide: SYNC_USER_PORT,
      useClass: SyncUserRepository,
    },
    {
      provide: USER_MANAGEMENT_PORT,
      useClass: UserManagementRepository,
    },
    {
      provide: USER_QUERY_PORT,
      useClass: UserQueryRepository,
    },
    {
      provide: USER_PROFILE_QUERY_PORT,
      useClass: UserProfileQueryRepository

    },
    {
      provide: USER_PROFILE_MANAGEMENT_PORT,
      useClass: UserProfileManagementRepository
    },
    {
      provide: ASTROLOGER_PROFILE_MANAGEMENT_PORT,
      useClass: AstrologerProfileManagementRepository
    },
    {
      provide: ASTROLOGER_PROFILE_QUERY_PORT,
      useClass: AstrologerProfileQueryRepository
    },
    // 3. Use Cases
    // Business logic that orchestrates user creation/syncing
    SyncUserUseCase,
    GetActiveAstrologersUseCase,
    GetUserProfileUseCase,
    UpdateUserCoreDetailsUseCase,
    UpdateUserProfileUseCase,
    GetActiveUsersUseCase,
    CreateUserProfileUseCase,
    AddUserRatingUseCase,
    UpdateUserProfileStatsUseCase,
    GetUserProfileStatsUseCase,
    GetTopRatedUserProfilesUseCase,
    GetTopRatedAstrologersUseCase,

  ],
  exports: [
    // Export use cases for other modules to use
    SyncUserUseCase,
    GetActiveAstrologersUseCase,
    GetUserProfileUseCase,
    UpdateUserCoreDetailsUseCase,
    GetActiveUsersUseCase,
  ],
})
export class UserModule { }
