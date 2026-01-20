import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { USER_PROFILE_MANAGEMENT_PORT, type UserProfileManagementPort, type UpdateProfileInput } from '../../interfaces/user-profile/user-profile-management.interface';

export interface UpdateUserProfileInput extends UpdateProfileInput {
  userId: string;
}

@Injectable()
export class UpdateUserProfileUseCase {
  private readonly logger = new Logger(UpdateUserProfileUseCase.name);

  constructor(
    @Inject(USER_PROFILE_MANAGEMENT_PORT)
    private readonly userProfileManagementPort: UserProfileManagementPort,
  ) {}

  async execute(input: UpdateUserProfileInput): Promise<UserProfile> {
    this.logger.debug(`Updating profile for user ${input.userId}`);

    try {
      const profile = await this.userProfileManagementPort.updateProfile(input.userId, {
        bio: input.bio,
        avatar_url: input.avatar_url,
        preferences: input.preferences,
      });

      this.logger.debug(`Profile updated for user ${input.userId}`);
      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to update profile for user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}