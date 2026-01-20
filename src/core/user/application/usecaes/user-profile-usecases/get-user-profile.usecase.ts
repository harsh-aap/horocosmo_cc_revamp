import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { USER_PROFILE_QUERY_PORT, type UserProfileQueryPort } from '../../interfaces/user-profile/user-profile-query.interface';

@Injectable()
export class GetUserProfileUseCase {
  private readonly logger = new Logger(GetUserProfileUseCase.name);

  constructor(
    @Inject(USER_PROFILE_QUERY_PORT)
    private readonly userProfileQueryPort: UserProfileQueryPort,
  ) {}

  async execute(userId: string): Promise<UserProfile | null> {
    this.logger.debug(`Getting profile for user ${userId}`);

    try {
      const profile = await this.userProfileQueryPort.findByUserId(userId);

      if (profile) {
        this.logger.debug(`Profile found for user ${userId}`);
      } else {
        this.logger.debug(`No profile found for user ${userId}`);
      }

      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to get profile for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}