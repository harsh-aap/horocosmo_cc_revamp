import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { USER_PROFILE_MANAGEMENT_PORT, type UserProfileManagementPort } from '../../interfaces/user-profile/user-profile-management.interface';

export interface CreateUserProfileInput {
  userId: string;
  bio?: string;
  avatar_url?: string;
}

@Injectable()
export class CreateUserProfileUseCase {
  private readonly logger = new Logger(CreateUserProfileUseCase.name);

  constructor(
    @Inject(USER_PROFILE_MANAGEMENT_PORT)
    private readonly userProfileManagementPort: UserProfileManagementPort,
  ) {}

  async execute(input: CreateUserProfileInput): Promise<UserProfile> {
    this.logger.debug(`Creating profile for user ${input.userId}`);

    try {
      const profile = await this.userProfileManagementPort.createProfile(input.userId, {
        bio: input.bio,
        avatar_url: input.avatar_url,
      });

      this.logger.debug(`Profile created for user ${input.userId}`);
      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to create profile for user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}