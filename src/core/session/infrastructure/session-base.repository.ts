import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultationSession, SessionStatus } from 'src/infrastructure/database/entities/consultation-session.entity';

@Injectable()
export class SessionBaseRepository {
    protected readonly logger = new Logger(SessionBaseRepository.name);

    constructor(
        @InjectRepository(ConsultationSession)
        protected readonly repo: Repository<ConsultationSession>,
    ) { }

    async findById(id: string): Promise<ConsultationSession | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByConversationId(conversationId: string): Promise<ConsultationSession | null> {
        return this.repo.findOne({ where: { conversation_id: conversationId } });
    }

    async findUserSessions(userId: string, status?: string, limit: number = 50): Promise<ConsultationSession[]> {
        const where: any = [
            { user_id: userId },
            { astrologer_id: userId },
        ];

        if (status) {
            where.forEach(w => w.status = status);
        }

        return this.repo.find({
            where,
            order: { created_at: 'DESC' },
            take: limit,
        });
    }

    async findAstrologerSessions(astrologerId: string, status?: string, limit: number = 50): Promise<ConsultationSession[]> {
        const where: any = { astrologer_id: astrologerId };
        if (status) where.status = status;

        return this.repo.find({
            where,
            order: { created_at: 'DESC' },
            take: limit,
        });
    }

    async findActiveSessions(limit: number = 100): Promise<ConsultationSession[]> {
        return this.repo.find({
            where: { status: SessionStatus.ACTIVE },
            order: { started_at: 'DESC' },
            take: limit,
        });
    }

    async findByStatus(status: SessionStatus, limit: number = 100): Promise<ConsultationSession[]> {
        return this.repo.find({
            where: { status },
            order: { created_at: 'DESC' },
            take: limit,
        });
    }

    async getSessionCount(userId: string, status?: string): Promise<number> {
        const where: any = [
            { user_id: userId },
            { astrologer_id: userId },
        ];

        if (status) {
            where.forEach(w => w.status = status);
        }

        return this.repo.count({ where });
    }

    async getActiveSessionCount(): Promise<number> {
        return this.repo.count({ where: { status: SessionStatus.ACTIVE } });
    }

    async save(session: ConsultationSession): Promise<ConsultationSession> {
        return this.repo.save(session);
    }

    async create(sessionData: Partial<ConsultationSession>): Promise<ConsultationSession> {
        const session = this.repo.create(sessionData);
        return this.repo.save(session);
    }
}