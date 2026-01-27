import { SessionParticipant, ParticipantRole, ConnectionStatus } from 'src/infrastructure/database/entities/session-participant.entity';

export const PARTICIPANT_MANAGEMENT_PORT = Symbol('PARTICIPANT_MANAGEMENT_PORT');

export interface ParticipantManagementPort {
  addParticipant(props: {
    sessionId: string;
    userId: string;
    participantRole: ParticipantRole;
  }): Promise<SessionParticipant>;

  removeParticipant(participantId: string): Promise<void>;
  updateConnectionStatus(participantId: string, status: ConnectionStatus): Promise<SessionParticipant>;
  reconnectParticipant(participantId: string): Promise<SessionParticipant>;
  disconnectParticipant(participantId: string): Promise<SessionParticipant>;
}