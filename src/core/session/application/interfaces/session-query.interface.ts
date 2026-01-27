import { ConsultationSession, SessionType, SessionStatus } from 'src/infrastructure/database/entities/consultation-session.entity';

export const SESSION_QUERY_PORT = Symbol('SESSION_QUERY_PORT');

export interface SessionQueryPort {
  findById(id: string): Promise<ConsultationSession | null>;
  findByConversationId(conversationId: string): Promise<ConsultationSession | null>;
  findUserSessions(userId: string, status?: SessionStatus, limit?: number): Promise<ConsultationSession[]>;
  findAstrologerSessions(astrologerId: string, status?: SessionStatus, limit?: number): Promise<ConsultationSession[]>;
  findActiveSessions(limit?: number): Promise<ConsultationSession[]>;
  findByStatus(status: SessionStatus, limit?: number): Promise<ConsultationSession[]>;
  getSessionCount(userId: string, status?: SessionStatus): Promise<number>;
  getActiveSessionCount(): Promise<number>;
}