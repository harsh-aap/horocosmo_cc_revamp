import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @OneToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 1:1 with User
  @JoinColumn({ name: 'user_id' }) 
  @Index() 
  user_id: string;
  
  // Profile Data
  @Column({ type: 'text', nullable: true }) bio?: string;
  @Column({ type: 'text', nullable: true }) avatar_url?: string;
  @Column({ type: 'jsonb', nullable: true }) preferences?: Record<string, any>;
  
  // Statistics
  @Column({ default: 0 }) total_consultations: number;
  @Column({ default: 0 }) completed_consultations: number;
  @Column('decimal', { precision: 3, scale: 2, default: 0 }) average_rating: number;
  @Column({ default: 0 }) total_ratings: number;
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  addRating(rating: number): void {
    this.total_ratings += 1;
    this.average_rating = ((this.average_rating * (this.total_ratings - 1)) + rating) / this.total_ratings;
    this.updated_at = new Date();
  }

  incrementConsultations(): void {
    this.total_consultations += 1;
    this.updated_at = new Date();
  }

  incrementCompletedConsultations(): void {
    this.completed_consultations += 1;
    this.updated_at = new Date();
  }

  updateProfile(updates: { bio?: string; avatar_url?: string; preferences?: Record<string, any> }): void {
    if (updates.bio !== undefined) this.bio = updates.bio;
    if (updates.avatar_url !== undefined) this.avatar_url = updates.avatar_url;
    if (updates.preferences !== undefined) this.preferences = updates.preferences;
    this.updated_at = new Date();
  }

  static create(props: { userId: string; bio?: string; avatar_url?: string }): Partial<UserProfile> {
    return {
      user_id: props.userId,
      bio: props.bio,
      avatar_url: props.avatar_url,
      total_consultations: 0,
      completed_consultations: 0,
      average_rating: 0,
      total_ratings: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}