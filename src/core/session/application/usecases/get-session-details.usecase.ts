import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_QUERY_PORT, type SessionQueryPort } from '../interfaces/session-query.interface';
import { PARTICIPANT_QUERY_PORT, type ParticipantQueryPort } from '../interfaces/participant-query.interface';

@Injectable()
export class GetSessionDetailsUseCase {
    private readonly logger = new Logger(GetSessionDetailsUseCase.name);

    constructor(
        @Inject(SESSION_QUERY_PORT)
        private readonly sessionRepo: SessionQueryPort,
        @Inject(PARTICIPANT_QUERY_PORT)
        private readonly participantRepo: ParticipantQueryPort,
    ) { }

    async execute(sessionId: string) {
        try {
            this.logger.log(`Getting details for session ${sessionId}`);

            const session = await this.sessionRepo.findById(sessionId);
            if (!session) throw new Error('Session not found');

            const participants = await this.participantRepo.findBySessionId(sessionId);

            return {
                session: {
                    id: session.id,
                    astrologerId: session.astrologer_id,
                    userId: session.user_id,
                    sessionType: session.session_type,
                    status: session.status,
                    conversationId: session.conversation_id,
                    startedAt: session.started_at,
                    endedAt: session.ended_at,
                    durationMinutes: session.duration_minutes,
                    totalCost: session.total_cost,
                    astrologerRating: session.astrologer_rating,
                    userRating: session.user_rating,
                    createdAt: session.created_at,
                },
                participants: participants.map(p => ({
                    id: p.id,
                    userId: p.user_id,
                    participantRole: p.participant_role,
                    joinedAt: p.joined_at,
                    leftAt: p.left_at,
                    connectionStatus: p.connection_status,
                })),
            };
        } catch (error) {
            this.logger.error(`Error getting session details: ${error.message}`, error.stack);
            throw error;
        }
    }
}