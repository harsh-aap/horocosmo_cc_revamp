import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { User } from './user.entity';

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  BLOCKED = 'blocked'
}

@Entity('conversations')
@Unique(['user_id', 'astrologer_id']) // One conversation per user-astrologer pair
export class Conversation {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User
  @JoinColumn({ name: 'user_id' }) 
  @Index() 
  user_id: string;
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User (astrologer)
  @JoinColumn({ name: 'astrologer_id' }) 
  @Index() 
  astrologer_id: string;
  
  @Column({ 
    type: 'enum', 
    enum: ConversationStatus, 
    default: ConversationStatus.ACTIVE 
  })
  status: ConversationStatus;
  
  @Column({ type: 'timestamp', nullable: true })
  last_message_at?: Date;
  
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // Store conversation settings, unread counts, etc.
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  updateLastMessage(): void {
    this.last_message_at = new Date();
    this.updated_at = new Date();
  }

  isActive(): boolean {
    return this.status === ConversationStatus.ACTIVE;
  }

  archive(): void {
    this.status = ConversationStatus.ARCHIVED;
    this.updated_at = new Date();
  }

  block(): void {
    this.status = ConversationStatus.BLOCKED;
    this.updated_at = new Date();
  }

  static create(props: { userId: string; astrologerId: string }): Partial<Conversation> {
    return {
      user_id: props.userId,
      astrologer_id: props.astrologerId,
      status: ConversationStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}