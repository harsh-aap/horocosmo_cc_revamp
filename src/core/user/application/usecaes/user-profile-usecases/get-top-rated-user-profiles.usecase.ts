import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { USER_PROFILE_QUERY_PORT, type UserProfileQueryPort } from '../../interfaces/user-profile/user-profile-query.interface';

export interface GetTopRatedProfilesInput {
    minRating: number;
    limit?: number;
}

@Injectable()
export class GetTopRatedUserProfilesUseCase {
    private readonly logger = new Logger(GetTopRatedUserProfilesUseCase.name);

    constructor(
        @Inject(USER_PROFILE_QUERY_PORT)
        private readonly userProfileQueryPort: UserProfileQueryPort,
    ) { }

    async execute(input: GetTopRatedProfilesInput): Promise<UserProfile[]> {
        this.logger.debug(`Getting top rated profiles (min rating: ${input.minRating}, limit: ${input.limit || 'unlimited'})`);

        try {
            const profiles = await this.userProfileQueryPort.findTopRatedProfiles(
                input.minRating,
                input.limit,
            );

            this.logger.debug(`Found ${profiles.length} top rated profiles`);
            return profiles;
        } catch (error) {
            this.logger.error(
                `Failed to get top rated profiles: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}