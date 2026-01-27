import { ConsultationSession, SessionType } from 'src/infrastructure/database/entities/consultation-session.entity';

export const SESSION_MANAGEMENT_PORT = Symbol('SESSION_MANAGEMENT_PORT');

export interface SessionManagementPort {
  createSession(props: {
    astrologerId: string;
    userId: string;
    sessionType: SessionType;
    conversationId?: string;
  }): Promise<ConsultationSession>;

  startSession(sessionId: string): Promise<ConsultationSession>;
  endSession(sessionId: string): Promise<ConsultationSession>;
  cancelSession(sessionId: string): Promise<ConsultationSession>;
  linkConversation(sessionId: string, conversationId: string): Promise<ConsultationSession>;
  updateSessionCost(sessionId: string, cost: number): Promise<ConsultationSession>;
  rateSession(sessionId: string, astrologerRating?: number, userRating?: number): Promise<ConsultationSession>;
}