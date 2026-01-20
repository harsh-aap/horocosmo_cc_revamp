import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_QUERY_PORT, type AstrologerProfileQueryPort } from '../../interfaces/user-astrologer/astrologer-profile-query.interface';

@Injectable()
export class GetAstrologerProfileUseCase {
  private readonly logger = new Logger(GetAstrologerProfileUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_QUERY_PORT)
    private readonly astrologerProfileQueryPort: AstrologerProfileQueryPort,
  ) {}

  async execute(astrologerId: string): Promise<AstrologerProfile | null> {
    this.logger.debug(`Getting astrologer profile for user ${astrologerId}`);

    try {
      const profile = await this.astrologerProfileQueryPort.findByAstrologerId(astrologerId);

      if (profile) {
        this.logger.debug(`Astrologer profile found for user ${astrologerId}`);
      } else {
        this.logger.debug(`No astrologer profile found for user ${astrologerId}`);
      }

      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to get astrologer profile for user ${astrologerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}