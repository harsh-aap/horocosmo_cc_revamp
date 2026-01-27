import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_MANAGEMENT_PORT, type SessionManagementPort } from '../interfaces/session-management.interface';
import { PARTICIPANT_MANAGEMENT_PORT, type ParticipantManagementPort } from '../interfaces/participant-management.interface';
import { SessionType } from 'src/infrastructure/database/entities/consultation-session.entity';
import { ParticipantRole } from 'src/infrastructure/database/entities/session-participant.entity';

@Injectable()
export class CreateSessionUseCase {
  private readonly logger = new Logger(CreateSessionUseCase.name);

  constructor(
    @Inject(SESSION_MANAGEMENT_PORT)
    private readonly sessionRepo: SessionManagementPort,
    @Inject(PARTICIPANT_MANAGEMENT_PORT)
    private readonly participantRepo: ParticipantManagementPort,
  ) {}

  async execute(props: {
    astrologerId: string;
    userId: string;
    sessionType: SessionType;
    conversationId?: string;
  }) {
    try {
      this.logger.log(`Creating ${props.sessionType} session between user ${props.userId} and astrologer ${props.astrologerId}`);

      const session = await this.sessionRepo.createSession(props);

      // Add participants
      await this.participantRepo.addParticipant({
        sessionId: session.id,
        userId: props.userId,
        participantRole: ParticipantRole.USER,
      });

      await this.participantRepo.addParticipant({
        sessionId: session.id,
        userId: props.astrologerId,
        participantRole: ParticipantRole.ASTROLOGER,
      });

      return {
        id: session.id,
        astrologerId: session.astrologer_id,
        userId: session.user_id,
        sessionType: session.session_type,
        status: session.status,
        conversationId: session.conversation_id,
        createdAt: session.created_at,
      };
    } catch (error) {
      this.logger.error(`Error creating session: ${error.message}`, error.stack);
      throw error;
    }
  }
}