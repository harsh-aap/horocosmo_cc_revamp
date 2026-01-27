import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionParticipant, ParticipantRole, ConnectionStatus } from 'src/infrastructure/database/entities/session-participant.entity';

@Injectable()
export class ParticipantBaseRepository {
  protected readonly logger = new Logger(ParticipantBaseRepository.name);

  constructor(
    @InjectRepository(SessionParticipant)
    protected readonly repo: Repository<SessionParticipant>,
  ) {}

  async findById(id: string): Promise<SessionParticipant | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findBySessionId(sessionId: string): Promise<SessionParticipant[]> {
    return this.repo.find({
      where: { session_id: sessionId },
      order: { joined_at: 'ASC' },
    });
  }

  async findByUserId(userId: string, limit: number = 50): Promise<SessionParticipant[]> {
    return this.repo.find({
      where: { user_id: userId },
      order: { joined_at: 'DESC' },
      take: limit,
    });
  }

  async findBySessionAndRole(sessionId: string, role: ParticipantRole): Promise<SessionParticipant | null> {
    return this.repo.findOne({
      where: {
        session_id: sessionId,
        participant_role: role,
      },
    });
  }

  async getConnectedParticipants(sessionId: string): Promise<SessionParticipant[]> {
    return this.repo.find({
      where: {
        session_id: sessionId,
        connection_status: ConnectionStatus.CONNECTED,
      },
    });
  }

  async getParticipantCount(sessionId: string): Promise<number> {
    return this.repo.count({ where: { session_id: sessionId } });
  }

  async save(participant: SessionParticipant): Promise<SessionParticipant> {
    return this.repo.save(participant);
  }

  async create(participantData: Partial<SessionParticipant>): Promise<SessionParticipant> {
    const participant = this.repo.create(participantData);
    return this.repo.save(participant);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}