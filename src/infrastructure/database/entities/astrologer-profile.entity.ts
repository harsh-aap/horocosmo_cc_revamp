import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('astrologer_profiles')
export class AstrologerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @OneToOne(() => User)
  @JoinColumn({ name: 'astrologer_id' })
  @Index()
  astrologer_id: string;

  // 💰 BILLING RATES (unique to astrologers)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  chat_rate_per_minute: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  call_rate_per_minute: number;

  // 🎯 CAPACITY MANAGEMENT
  @Column({ default: 1 })
  max_concurrent_sessions: number;

  @Column({ type: 'timestamp', nullable: true })
  last_active_at?: Date;

  // 📊 PERFORMANCE METRICS
  @Column({ type: 'jsonb', nullable: true })
  performance_metrics?: Record<string, any>;

  // 🏆 SPECIALIZATIONS
  @Column({ type: 'jsonb', nullable: true })
  specializations?: string[];

  // 📈 MONTHLY PERFORMANCE
  @Column({ default: 0 })
  monthly_sessions: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  monthly_rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 💰 BILLING CALCULATIONS
  calculateChatCost(minutes: number): number {
    return this.chat_rate_per_minute * minutes;
  }

  calculateCallCost(minutes: number): number {
    return this.call_rate_per_minute * minutes;
  }

  // 🎯 CAPACITY CHECKS
  canHandleMoreSessions(currentSessions: number): boolean {
    return currentSessions < this.max_concurrent_sessions;
  }

  // 📊 PERFORMANCE UPDATES
  updateMonthlyStats(sessions: number, rating: number): void {
    this.monthly_sessions = sessions;
    this.monthly_rating = rating;
    this.updated_at = new Date();
  }

  static create(astrologerId: string, chatRate: number, callRate: number): AstrologerProfile {
    return {
      astrologer_id: astrologerId,
      chat_rate_per_minute: chatRate,
      call_rate_per_minute: callRate,
      max_concurrent_sessions: 1,
      monthly_sessions: 0,
      monthly_rating: 0,
      created_at: new Date(),
      updated_at: new Date(),
    } as AstrologerProfile;
  }
}