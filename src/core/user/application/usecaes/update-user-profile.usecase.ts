import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  type UserProfilePort,
  UpdateProfileInput,
  USER_PROFILE_PORT,
} from '../interfaces/user-profile.interface';

@Injectable()
export class UpdateUserProfileUseCase {
  private readonly logger = new Logger(UpdateUserProfileUseCase.name);

  constructor(
    @Inject(USER_PROFILE_PORT)
    private readonly userProfilePort: UserProfilePort,
  ) {}

  async execute(userId: string, updates: UpdateProfileInput): Promise<User> {
    this.logger.debug(`Updating profile for user: ${userId}`);

    try {
      const updatedUser = await this.userProfilePort.updateProfile(
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
