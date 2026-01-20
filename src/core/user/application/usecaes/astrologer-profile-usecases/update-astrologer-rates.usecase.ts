import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_MANAGEMENT_PORT, type AstrologerProfileManagementPort, UpdateRatesInput } from '../../interfaces/user-astrologer/astrologer-profile-management.interface';

@Injectable()
export class UpdateAstrologerRatesUseCase {
    private readonly logger = new Logger(UpdateAstrologerRatesUseCase.name);

    constructor(
        @Inject(ASTROLOGER_PROFILE_MANAGEMENT_PORT)
        private readonly astrologerProfileManagementPort: AstrologerProfileManagementPort,
    ) { }

    async execute(astrologerId: string, input: UpdateRatesInput): Promise<AstrologerProfile> {
        this.logger.debug(`Updating rates for astrologer ${astrologerId}: chat=${input.chat_rate_per_minute}, call=${input.call_rate_per_minute}`);

        try {
            const profile = await this.astrologerProfileManagementPort.updateRates(astrologerId, {
                chat_rate_per_minute: input.chat_rate_per_minute,
                call_rate_per_minute: input.call_rate_per_minute,
            });

            this.logger.debug(`Rates updated for astrologer ${astrologerId}`);
            return profile;
        } catch (error) {
            this.logger.error(
                `Failed to update rates for astrologer ${astrologerId}: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}