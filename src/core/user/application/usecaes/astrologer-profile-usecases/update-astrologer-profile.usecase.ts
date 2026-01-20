import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_MANAGEMENT_PORT, type AstrologerProfileManagementPort, UpdateAstrologerProfileInput } from '../../interfaces/user-astrologer/astrologer-profile-management.interface';

@Injectable()
export class UpdateAstrologerProfileUseCase {
    private readonly logger = new Logger(UpdateAstrologerProfileUseCase.name);

    constructor(
        @Inject(ASTROLOGER_PROFILE_MANAGEMENT_PORT)
        private readonly astrologerProfileManagementPort: AstrologerProfileManagementPort,
    ) { }

    async execute(astrologerId: string, input: UpdateAstrologerProfileInput): Promise<AstrologerProfile> {
        try {
            const profile = await this.astrologerProfileManagementPort.updateProfile(astrologerId, {
                chat_rate_per_minute: input.chat_rate_per_minute,
                call_rate_per_minute: input.call_rate_per_minute,
                max_concurrent_sessions: input.max_concurrent_sessions,
                specializations: input.specializations,
            });

            this.logger.debug(`Astrologer profile updated for user ${astrologerId}`);
            return profile;
        } catch (error) {
            this.logger.error(
                `Failed to update astrologer profile for user ${astrologerId}: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}