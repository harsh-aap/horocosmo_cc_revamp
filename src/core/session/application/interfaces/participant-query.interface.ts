import { SessionParticipant, ParticipantRole, ConnectionStatus } from 'src/infrastructure/database/entities/session-participant.entity';

export const PARTICIPANT_QUERY_PORT = Symbol('PARTICIPANT_QUERY_PORT');

export interface ParticipantQueryPort {
  findById(id: string): Promise<SessionParticipant | null>;
  findBySessionId(sessionId: string): Promise<SessionParticipant[]>;
  findByUserId(userId: string, limit?: number): Promise<SessionParticipant[]>;
  findBySessionAndRole(sessionId: string, role: ParticipantRole): Promise<SessionParticipant | null>;
  getConnectedParticipants(sessionId: string): Promise<SessionParticipant[]>;
  getParticipantCount(sessionId: string): Promise<number>;
}