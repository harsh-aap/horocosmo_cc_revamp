import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_MANAGEMENT_PORT, type SessionManagementPort } from '../interfaces/session-management.interface';

@Injectable()
export class StartSessionUseCase {
    private readonly logger = new Logger(StartSessionUseCase.name);

    constructor(
        @Inject(SESSION_MANAGEMENT_PORT)
        private readonly sessionRepo: SessionManagementPort,
    ) { }

    async execute(sessionId: string) {
        try {
            this.logger.log(`Starting session ${sessionId}`);

            const session = await this.sessionRepo.startSession(sessionId);

            return {
                id: session.id,
                status: session.status,
                startedAt: session.started_at,
                updatedAt: session.updated_at,
            };
        } catch (error) {
            this.logger.error(`Error starting session: ${error.message}`, error.stack);
            throw error;
        }
    }
}