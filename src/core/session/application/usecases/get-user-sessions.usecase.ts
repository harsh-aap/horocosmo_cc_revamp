import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_QUERY_PORT, type SessionQueryPort } from '../interfaces/session-query.interface';
import { SessionStatus } from 'src/infrastructure/database/entities/consultation-session.entity';

@Injectable()
export class GetUserSessionsUseCase {
    private readonly logger = new Logger(GetUserSessionsUseCase.name);

    constructor(
        @Inject(SESSION_QUERY_PORT)
        private readonly sessionRepo: SessionQueryPort,
    ) { }

    async execute(userId: string, status?: SessionStatus, limit: number = 50) {
        try {
            this.logger.log(`Getting sessions for user ${userId}`);

            const sessions = await this.sessionRepo.findUserSessions(userId, status, limit);

            return sessions.map(session => ({
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
                createdAt: session.created_at,
            }));
        } catch (error) {
            this.logger.error(`Error getting user sessions: ${error.message}`, error.stack);
            throw error;
        }
    }
}