import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_QUERY_PORT, type AstrologerProfileQueryPort } from '../../interfaces/user-astrologer/astrologer-profile-query.interface';

@Injectable()
export class GetAstrologerAvailabilityUseCase {
  private readonly logger = new Logger(GetAstrologerAvailabilityUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_QUERY_PORT)
    private readonly astrologerProfileQueryPort: AstrologerProfileQueryPort,
  ) {}

  async execute(): Promise<AstrologerProfile[]> {
    this.logger.debug('Getting available astrologers');

    try {
      const availableAstrologers = await this.astrologerProfileQueryPort.findAvailableAstrologers();

      this.logger.debug(`Found ${availableAstrologers.length} available astrologers`);
      return availableAstrologers;
    } catch (error) {
      this.logger.error(
        `Failed to get available astrologers: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}