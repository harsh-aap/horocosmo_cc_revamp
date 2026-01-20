import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_MANAGEMENT_PORT, type AstrologerProfileManagementPort } from '../../interfaces/user-astrologer/astrologer-profile-management.interface';

export interface UpdateAstrologerStatsInput {
  astrologerId: string;
  sessionsCount: number;
  rating: number;
}

@Injectable()
export class UpdateAstrologerStatsUseCase {
  private readonly logger = new Logger(UpdateAstrologerStatsUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_MANAGEMENT_PORT)
    private readonly astrologerProfileManagementPort: AstrologerProfileManagementPort,
  ) {}

  async execute(input: UpdateAstrologerStatsInput): Promise<AstrologerProfile> {
    this.logger.debug(`Updating monthly stats for astrologer ${input.astrologerId}: sessions=${input.sessionsCount}, rating=${input.rating}`);

    try {
      const profile = await this.astrologerProfileManagementPort.updateMonthlyStats(
        input.astrologerId,
        input.sessionsCount,
        input.rating,
      );

      this.logger.debug(`Monthly stats updated for astrologer ${input.astrologerId}`);
      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to update stats for astrologer ${input.astrologerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}