import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Index()
  user_id: string;

  // 💰 BALANCE MANAGEMENT (transactional isolation)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  current_balance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_credited: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_debited: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  balance_updated_at: Date;

  // 👤 EXTENDED PROFILE
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'text', nullable: true })
  avatar_url?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>;

  // 📊 CONSULTATION STATISTICS
  @Column({ default: 0 })
  total_consultations: number;

  @Column({ default: 0 })
  completed_consultations: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ default: 0 })
  total_ratings: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 💰 BALANCE BUSINESS METHODS
  canAfford(amount: number): boolean {
    return this.current_balance >= amount;
  }

  deductBalance(amount: number): void {
    if (!this.canAfford(amount)) {
      throw new Error('Insufficient balance');
    }
    this.current_balance -= amount;
    this.total_debited += amount;
    this.balance_updated_at = new Date();
    this.updated_at = new Date();
  }

  addBalance(amount: number): void {
    this.current_balance += amount;
    this.total_credited += amount;
    this.balance_updated_at = new Date();
    this.updated_at = new Date();
  }

  addRating(rating: number): void {
    const totalRating = this.average_rating * this.total_ratings;
    this.total_ratings += 1;
    this.average_rating = (totalRating + rating) / this.total_ratings;
    this.updated_at = new Date();
  }

  static create(userId: string, initialBalance: number = 0): UserProfile {
    const now = new Date();
    return {
      user_id: userId,
      current_balance: initialBalance,
      total_credited: initialBalance,
      total_debited: 0,
      balance_updated_at: now,
      total_consultations: 0,
      completed_consultations: 0,
      average_rating: 0,
      total_ratings: 0,
      created_at: now,
      updated_at: now,
    } as UserProfile;
  }
}