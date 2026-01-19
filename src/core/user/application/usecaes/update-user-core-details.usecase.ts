import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  type UserManagementPort,
  UpdateCoreDetailsInput,
  USER_MANAGEMENT_PORT,
} from '../interfaces/user-management.interface';

@Injectable()
export class UpdateUserProfileUseCase {
  private readonly logger = new Logger(UpdateUserProfileUseCase.name);

  constructor(
    @Inject(USER_MANAGEMENT_PORT)
    private readonly userManagementPort: UserManagementPort,
  ) {}

  async execute(userId: string, updates: UpdateCoreDetailsInput): Promise<User> {
    this.logger.debug(`Updating profile for user: ${userId}`);

    try {
      const updatedUser = await this.userManagementPort.updateUserCoreDetails(
        userId,
        updates,
      );

      this.logger.debug(`Successfully updated profile for user: ${userId}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Failed to update profile for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
