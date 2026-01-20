import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Check, Unique } from 'typeorm';
import { User } from './user.entity';
import { ConsultationSession } from './consultation-session.entity';

export enum ParticipantRole { ASTROLOGER = 'astrologer', USER = 'user' }
export enum ConnectionStatus { CONNECTED = 'connected', DISCONNECTED = 'disconnected', RECONNECTING = 'reconnecting' }

@Entity('session_participants')
@Unique(['session_id', 'participant_role'])
@Check(`"participant_role" IN ('astrologer', 'user')`)
@Check(`"connection_status" IN ('connected', 'disconnected', 'reconnecting')`)
export class SessionParticipant {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @ManyToOne(() => ConsultationSession, { onDelete: 'CASCADE' }) // 🔗 Many:1 with Session
  @JoinColumn({ name: 'session_id' }) 
  @Index() 
  session_id: string;
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User
  @JoinColumn({ name: 'user_id' }) 
  @Index() 
  user_id: string;
  
  @Column({ type: 'enum', enum: ParticipantRole }) participant_role: ParticipantRole;
  @Column({ type: 'timestamp' }) joined_at: Date;
  @Column({ type: 'timestamp', nullable: true }) left_at?: Date;
  @Column({ type: 'enum', enum: ConnectionStatus, default: ConnectionStatus.CONNECTED }) connection_status: ConnectionStatus;
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  leaveSession(): void {
    this.left_at = new Date();
    this.connection_status = ConnectionStatus.DISCONNECTED;
    this.updated_at = new Date();
  }

  reconnect(): void {
    this.connection_status = ConnectionStatus.CONNECTED;
    this.updated_at = new Date();
  }

  disconnect(): void {
    this.connection_status = ConnectionStatus.DISCONNECTED;
    this.updated_at = new Date();
  }

  isConnected(): boolean {
    return this.connection_status === ConnectionStatus.CONNECTED;
  }

  static create(props: {
    sessionId: string;
    userId: string;
    participantRole: ParticipantRole;
  }): Partial<SessionParticipant> {
    return {
      session_id: props.sessionId,
      user_id: props.userId,
      participant_role: props.participantRole,
      joined_at: new Date(),
      connection_status: ConnectionStatus.CONNECTED,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}