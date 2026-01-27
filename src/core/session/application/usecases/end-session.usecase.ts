import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_MANAGEMENT_PORT, type SessionManagementPort } from '../interfaces/session-management.interface';

@Injectable()
export class EndSessionUseCase {
  private readonly logger = new Logger(EndSessionUseCase.name);

  constructor(
    @Inject(SESSION_MANAGEMENT_PORT)
    private readonly sessionRepo: SessionManagementPort,
  ) {}

  async execute(sessionId: string) {
    try {
      this.logger.log(`Ending session ${sessionId}`);

      const session = await this.sessionRepo.endSession(sessionId);

      return {
        id: session.id,
        status: session.status,
        endedAt: session.ended_at,
        durationMinutes: session.duration_minutes,
        updatedAt: session.updated_at,
      };
    } catch (error) {
      this.logger.error(`Error ending session: ${error.message}`, error.stack);
      throw error;
    }
  }
}