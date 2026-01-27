import { Injectable } from '@nestjs/common';
import { SessionBaseRepository } from './session-base.repository';
import { SessionManagementPort } from '../application/interfaces/session-management.interface';
import { ConsultationSession, SessionType } from 'src/infrastructure/database/entities/consultation-session.entity';

@Injectable()
export class SessionManagementRepository
  extends SessionBaseRepository
  implements SessionManagementPort
{
  async createSession(props: {
    astrologerId: string;
    userId: string;
    sessionType: SessionType;
    conversationId?: string;
  }): Promise<ConsultationSession> {
    return this.create(ConsultationSession.create(props));
  }

  async startSession(sessionId: string): Promise<ConsultationSession> {
    const session = await this.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.startSession();
    return this.save(session);
  }

  async endSession(sessionId: string): Promise<ConsultationSession> {
    const session = await this.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.endSession();
    return this.save(session);
  }

  async cancelSession(sessionId: string): Promise<ConsultationSession> {
    const session = await this.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.cancelSession();
    return this.save(session);
  }

  async linkConversation(sessionId: string, conversationId: string): Promise<ConsultationSession> {
    const session = await this.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.linkConversation(conversationId);
    return this.save(session);
  }

  async updateSessionCost(sessionId: string, cost: number): Promise<ConsultationSession> {
    const session = await this.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.total_cost = cost;
    session.updated_at = new Date();
    return this.save(session);
  }

  async rateSession(sessionId: string, astrologerRating?: number, userRating?: number): Promise<ConsultationSession> {
    const session = await this.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.addRating(astrologerRating, userRating);
    return this.save(session);
  }
}