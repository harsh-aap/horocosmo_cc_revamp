import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_QUERY_PORT, type AstrologerProfileQueryPort } from '../../interfaces/user-astrologer/astrologer-profile-query.interface';

export interface GetTopRatedAstrologersInput {
  minRating?: number;
  limit?: number;
}

@Injectable()
export class GetTopRatedAstrologersUseCase {
  private readonly logger = new Logger(GetTopRatedAstrologersUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_QUERY_PORT)
    private readonly astrologerProfileQueryPort: AstrologerProfileQueryPort,
  ) {}

  async execute(input: GetTopRatedAstrologersInput = {}): Promise<AstrologerProfile[]> {
    const minRating = input.minRating || 4.0;
    const limit = input.limit || 10;

    this.logger.debug(`Getting top rated astrologers (min rating: ${minRating}, limit: ${limit})`);

    try {
      const astrologers = await this.astrologerProfileQueryPort.findTopRatedAstrologers(minRating, limit);

      this.logger.debug(`Found ${astrologers.length} top rated astrologers`);
      return astrologers;
    } catch (error) {
      this.logger.error(
        `Failed to get top rated astrologers: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}