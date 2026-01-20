import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_QUERY_PORT, type AstrologerProfileQueryPort } from '../../interfaces/user-astrologer/astrologer-profile-query.interface';

export interface GetAstrologerBySpecializationInput {
  specialization: string;
  limit?: number;
}

@Injectable()
export class GetAstrologerBySpecializationUseCase {
  private readonly logger = new Logger(GetAstrologerBySpecializationUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_QUERY_PORT)
    private readonly astrologerProfileQueryPort: AstrologerProfileQueryPort,
  ) {}

  async execute(input: GetAstrologerBySpecializationInput): Promise<AstrologerProfile[]> {
    const limit = input.limit || 10;

    this.logger.debug(`Getting astrologers by specialization: ${input.specialization} (limit: ${limit})`);

    try {
      const astrologers = await this.astrologerProfileQueryPort.findBySpecialization(input.specialization, limit);

      this.logger.debug(`Found ${astrologers.length} astrologers with specialization ${input.specialization}`);
      return astrologers;
    } catch (error) {
      this.logger.error(
        `Failed to get astrologers by specialization ${input.specialization}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}