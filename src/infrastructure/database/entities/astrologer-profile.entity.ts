import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

export enum AstrologerAvailabilityStatus { OFFLINE = 'offline', AVAILABLE = 'available', BUSY = 'busy' }

@Entity('astrologer_profiles')
export class AstrologerProfile {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @OneToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 1:1 with User (astrologers only)
  @JoinColumn({ name: 'astrologer_id' }) 
  @Index() 
  astrologer_id: string;
  
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) chat_rate_per_minute: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) call_rate_per_minute: number;
  @Column({ default: 1 }) max_concurrent_sessions: number;
  
  @Column({ type: 'jsonb', nullable: true }) specializations?: string[];
  @Column({ type: 'jsonb', nullable: true }) performance_metrics?: Record<string, any>;
  
  @Column({ type: 'timestamp', nullable: true }) last_active_at?: Date;
  @Column({ default: 0 }) monthly_sessions: number;
  @Column('decimal', { precision: 3, scale: 2, default: 0 }) monthly_rating: number;
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  calculateChatCost(minutes: number): number {
    return this.chat_rate_per_minute * minutes;
  }

  calculateCallCost(minutes: number): number {
    return this.call_rate_per_minute * minutes;
  }

  canHandleMoreSessions(currentSessions: number): boolean {
    return currentSessions < this.max_concurrent_sessions;
  }

  updateLastActive(): void {
    this.last_active_at = new Date();
    this.updated_at = new Date();
  }

  updateMonthlyStats(sessionsCount: number, rating: number): void {
    this.monthly_sessions = sessionsCount;
    this.monthly_rating = rating;
    this.updated_at = new Date();
  }

  isAvailable(): boolean {
    return this.last_active_at ? 
      (Date.now() - this.last_active_at.getTime()) < (24 * 60 * 60 * 1000) : 
      false;
  }

  static create(props: { 
    astrologerId: string; 
    chatRatePerMinute: number; 
    callRatePerMinute: number;
    maxConcurrentSessions?: number;
    specializations?: string[];
  }): Partial<AstrologerProfile> {
    return {
      astrologer_id: props.astrologerId,
      chat_rate_per_minute: props.chatRatePerMinute,
      call_rate_per_minute: props.callRatePerMinute,
      max_concurrent_sessions: props.maxConcurrentSessions || 1,
      specializations: props.specializations,
      monthly_sessions: 0,
      monthly_rating: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}