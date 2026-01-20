import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { USER_PROFILE_MANAGEMENT_PORT, type UserProfileManagementPort } from '../../interfaces/user-profile/user-profile-management.interface';

export interface AddRatingInput {
    userId: string; // User being rated
    rating: number; // 1-5 rating
}

@Injectable()
export class AddUserRatingUseCase {
    private readonly logger = new Logger(AddUserRatingUseCase.name);

    constructor(
        @Inject(USER_PROFILE_MANAGEMENT_PORT)
        private readonly userProfileManagementPort: UserProfileManagementPort,
    ) { }

    async execute(input: AddRatingInput): Promise<UserProfile> {
        this.logger.debug(`Adding rating ${input.rating} for user ${input.userId}`);

        try {
            const profile = await this.userProfileManagementPort.addRating(input.userId, input.rating);

            this.logger.debug(`Rating added for user ${input.userId}, new average: ${profile.average_rating}`);
            return profile;
        } catch (error) {
            this.logger.error(
                `Failed to add rating for user ${input.userId}: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}