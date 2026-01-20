import { Inject, Injectable, Logger } from '@nestjs/common';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';
import { ASTROLOGER_PROFILE_MANAGEMENT_PORT, type AstrologerProfileManagementPort } from '../../interfaces/user-astrologer/astrologer-profile-management.interface';

export interface CreateAstrologerProfileInput {
  astrologerId: string;
  chatRatePerMinute: number;
  callRatePerMinute: number;
  maxConcurrentSessions?: number;
  specializations?: string[];
}

@Injectable()
export class CreateAstrologerProfileUseCase {
  private readonly logger = new Logger(CreateAstrologerProfileUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_MANAGEMENT_PORT)
    private readonly astrologerProfileManagementPort: AstrologerProfileManagementPort,
  ) {}

  async execute(input: CreateAstrologerProfileInput): Promise<AstrologerProfile> {
    this.logger.debug(`Creating astrologer profile for user ${input.astrologerId}`);

    try {
      const profile = await this.astrologerProfileManagementPort.createProfile(input.astrologerId, {
        chatRatePerMinute: input.chatRatePerMinute,
        callRatePerMinute: input.callRatePerMinute,
        maxConcurrentSessions: input.maxConcurrentSessions,
        specializations: input.specializations,
      });

      this.logger.debug(`Astrologer profile created for user ${input.astrologerId}`);
      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to create astrologer profile for user ${input.astrologerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}