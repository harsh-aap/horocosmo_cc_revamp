import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_PROFILE_MANAGEMENT_PORT, type UserProfileManagementPort } from '../../interfaces/user-profile/user-profile-management.interface';

export interface ProfileStats {
    total_consultations: number;
    completed_consultations: number;
    average_rating: number;
    total_ratings: number;
}

@Injectable()
export class GetUserProfileStatsUseCase {
    private readonly logger = new Logger(GetUserProfileStatsUseCase.name);

    constructor(
        @Inject(USER_PROFILE_MANAGEMENT_PORT)
        private readonly userProfileManagementPort: UserProfileManagementPort,
    ) { }

    async execute(userId: string): Promise<ProfileStats> {
        this.logger.debug(`Getting stats for user ${userId}`);

        try {
            const stats = await this.userProfileManagementPort.getStats(userId);

            this.logger.debug(`Stats retrieved for user ${userId}: ${stats.total_consultations} consultations`);
            return stats;
        } catch (error) {
            this.logger.error(
                `Failed to get stats for user ${userId}: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}