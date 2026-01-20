import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Check, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';

export enum SessionType { CHAT = 'chat', CALL = 'call' }
export enum SessionStatus { WAITING = 'waiting', ACTIVE = 'active', COMPLETED = 'completed', CANCELLED = 'cancelled' }

@Entity('consultation_sessions')
@Check(`"session_type" IN ('chat', 'call')`)
@Check(`"status" IN ('waiting', 'active', 'completed', 'cancelled')`)
export class ConsultationSession {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  // 🔗 1:1 with Conversation (optional - for chat sessions)
  @Column('uuid', { nullable: true })
  @OneToOne(() => Conversation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'conversation_id' })
  @Index()
  conversation_id?: string;
  
  @Column({ type: 'enum', enum: SessionType }) session_type: SessionType;
  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.WAITING }) @Index() status: SessionStatus;
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User (astrologer)
  @JoinColumn({ name: 'astrologer_id' }) 
  @Index() 
  astrologer_id: string;
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User (client)
  @JoinColumn({ name: 'user_id' }) 
  @Index() 
  user_id: string;
  
  @Column({ type: 'timestamp', nullable: true }) started_at?: Date;
  @Column({ type: 'timestamp', nullable: true }) ended_at?: Date;
  @Column({ type: 'int', nullable: true }) duration_minutes?: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: true }) total_cost?: number;
  @Column('decimal', { precision: 3, scale: 2, nullable: true }) astrologer_rating?: number;
  @Column('decimal', { precision: 3, scale: 2, nullable: true }) user_rating?: number;
  @Column({ type: 'jsonb', nullable: true }) session_metadata?: Record<string, any>;
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  linkConversation(conversationId: string): void {
    this.conversation_id = conversationId;
    this.updated_at = new Date();
  }

  startSession(): void {
    this.started_at = new Date();
    this.status = SessionStatus.ACTIVE;
    this.updated_at = new Date();
  }

  endSession(): void {
    this.ended_at = new Date();
    this.status = SessionStatus.COMPLETED;
    if (this.started_at && this.ended_at) {
      this.duration_minutes = Math.ceil((this.ended_at.getTime() - this.started_at.getTime()) / (1000 * 60));
    }
    this.updated_at = new Date();
  }

  cancelSession(): void {
    this.status = SessionStatus.CANCELLED;
    this.ended_at = new Date();
    this.updated_at = new Date();
  }

  addRating(astrologerRating?: number, userRating?: number): void {
    if (astrologerRating) this.astrologer_rating = astrologerRating;
    if (userRating) this.user_rating = userRating;
    this.updated_at = new Date();
  }

  isActive(): boolean {
    return this.status === SessionStatus.ACTIVE;
  }

  isCompleted(): boolean {
    return this.status === SessionStatus.COMPLETED;
  }

  calculateCost(chatRatePerMinute: number, callRatePerMinute: number): number {
    if (!this.duration_minutes) return 0;
    const rate = this.session_type === SessionType.CHAT ? chatRatePerMinute : callRatePerMinute;
    return Math.ceil(this.duration_minutes) * rate; // Round up to nearest minute
  }

  static create(props: { 
    astrologerId: string; 
    userId: string; 
    sessionType: SessionType;
    conversationId?: string;
  }): Partial<ConsultationSession> {
    return {
      astrologer_id: props.astrologerId,
      user_id: props.userId,
      session_type: props.sessionType,
      conversation_id: props.conversationId,
      status: SessionStatus.WAITING,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}