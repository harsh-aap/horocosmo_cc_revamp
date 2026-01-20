import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';
import { USER_PROFILE_MANAGEMENT_PORT, type UserProfileManagementPort } from '../../interfaces/user-profile/user-profile-management.interface';

export interface UpdateUserProfileStatsInput {
    userId: string;
    incrementConsultations?: boolean;
    incrementCompletedConsultations?: boolean;
}

@Injectable()
export class UpdateUserProfileStatsUseCase {
    private readonly logger = new Logger(UpdateUserProfileStatsUseCase.name);

    constructor(
        @Inject(USER_PROFILE_MANAGEMENT_PORT)
        private readonly userProfileManagementPort: UserProfileManagementPort,
    ) { }

    async execute(input: UpdateUserProfileStatsInput): Promise<UserProfile> {
        this.logger.debug(`Updating stats for user ${input.userId}`);

        try {
            let profile = await this.userProfileManagementPort.findByUserId(input.userId);

            if (!profile) {
                this.logger.debug(`Profile not found, creating for user ${input.userId}`);
                profile = await this.userProfileManagementPort.createProfile(input.userId);
            }

            if (input.incrementConsultations) {
                profile = await this.userProfileManagementPort.incrementConsultations(input.userId);
                this.logger.debug(`Incremented consultations for user ${input.userId}`);
            }

            if (input.incrementCompletedConsultations) {
                profile = await this.userProfileManagementPort.incrementCompletedConsultations(input.userId);
                this.logger.debug(`Incremented completed consultations for user ${input.userId}`);
            }

            return profile;
        } catch (error) {
            this.logger.error(
                `Failed to update stats for user ${input.userId}: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}