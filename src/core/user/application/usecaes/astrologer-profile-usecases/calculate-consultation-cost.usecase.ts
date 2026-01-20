import { Inject, Injectable, Logger } from '@nestjs/common';
import { ASTROLOGER_PROFILE_MANAGEMENT_PORT, type AstrologerProfileManagementPort } from '../../interfaces/user-astrologer/astrologer-profile-management.interface';

export interface CalculateConsultationCostInput {
  astrologerId: string;
  sessionType: 'chat' | 'call';
  minutes: number;
}

@Injectable()
export class CalculateConsultationCostUseCase {
  private readonly logger = new Logger(CalculateConsultationCostUseCase.name);

  constructor(
    @Inject(ASTROLOGER_PROFILE_MANAGEMENT_PORT)
    private readonly astrologerProfileManagementPort: AstrologerProfileManagementPort,
  ) {}

  async execute(input: CalculateConsultationCostInput): Promise<number> {
    this.logger.debug(`Calculating cost for astrologer ${input.astrologerId}: ${input.sessionType} for ${input.minutes} minutes`);

    try {
      let cost: number;

      if (input.sessionType === 'chat') {
        cost = await this.astrologerProfileManagementPort.calculateChatCost(input.astrologerId, input.minutes);
      } else {
        cost = await this.astrologerProfileManagementPort.calculateCallCost(input.astrologerId, input.minutes);
      }

      this.logger.debug(`Calculated cost: ${cost} for ${input.sessionType} session`);
      return cost;
    } catch (error) {
      this.logger.error(
        `Failed to calculate cost for astrologer ${input.astrologerId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}