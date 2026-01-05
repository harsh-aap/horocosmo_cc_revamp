import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/database/entities/user.entity';
// Application Layer
import { SyncUserUseCase } from './application/usecaes/sync-user.usecase';
// Infrastructure Layer
import { UserRepository } from './infrastructure/user.repository';
// Presentation Layer
import { UserController } from './presentation/sync-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register User entity for this module
  ],
  controllers: [
    UserController, // Register the HTTP controller
  ],
  providers: [
    // Repository implementation
    UserRepository,
    // Dependency injection: Map interface to implementation
    {
      provide: 'SyncUserPort',
      useClass: UserRepository,
    },
    // Use Cases (business logic)
    SyncUserUseCase,
  ],
  exports: [
    SyncUserUseCase, // Export use case for other modules to use
  ],
})
export class UserModule {}