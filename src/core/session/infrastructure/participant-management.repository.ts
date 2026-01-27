import { Injectable } from '@nestjs/common';
import { ParticipantBaseRepository } from './participant-base.repository';
import { ParticipantManagementPort } from '../application/interfaces/participant-management.interface';
import { SessionParticipant, ParticipantRole, ConnectionStatus } from 'src/infrastructure/database/entities/session-participant.entity';

@Injectable()
export class ParticipantManagementRepository
  extends ParticipantBaseRepository
  implements ParticipantManagementPort
{
  async addParticipant(props: {
    sessionId: string;
    userId: string;
    participantRole: ParticipantRole;
  }): Promise<SessionParticipant> {
    return this.create(SessionParticipant.create(props));
  }

  async removeParticipant(participantId: string): Promise<void> {
    const participant = await this.findById(participantId);
    if (!participant) throw new Error('Participant not found');

    participant.leaveSession();
    await this.save(participant);
    await this.delete(participantId);
  }

  async updateConnectionStatus(participantId: string, status: ConnectionStatus): Promise<SessionParticipant> {
    const participant = await this.findById(participantId);
    if (!participant) throw new Error('Participant not found');

    participant.connection_status = status;
    participant.updated_at = new Date();
    return this.save(participant);
  }

  async reconnectParticipant(participantId: string): Promise<SessionParticipant> {
    const participant = await this.findById(participantId);
    if (!participant) throw new Error('Participant not found');

    participant.reconnect();
    return this.save(participant);
  }

  async disconnectParticipant(participantId: string): Promise<SessionParticipant> {
    const participant = await this.findById(participantId);
    if (!participant) throw new Error('Participant not found');

    participant.disconnect();
    return this.save(participant);
  }
}