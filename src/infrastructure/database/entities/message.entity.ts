import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';
import { ConsultationSession } from './consultation-session.entity';

export enum MessageType { TEXT = 'text', IMAGE = 'image', FILE = 'file', SYSTEM = 'system' }

@Entity('messages')
@Check(`"message_type" IN ('text', 'image', 'file', 'system')`)
export class Message {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' }) // 🔗 Many:1 with Conversation
  @JoinColumn({ name: 'conversation_id' }) 
  @Index() 
  conversation_id: string;
  
  @Column('uuid', { nullable: true }) 
  @ManyToOne(() => ConsultationSession, { onDelete: 'SET NULL' }) // 🔗 Many:1 with Session (optional)
  @JoinColumn({ name: 'session_id' }) 
  @Index() 
  session_id?: string; // Nullable - messages can exist outside sessions
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User (sender)
  @JoinColumn({ name: 'sender_id' }) 
  @Index() 
  sender_id: string;
  
  @Column({ type: 'enum', enum: MessageType }) message_type: MessageType;
  @Column({ type: 'text' }) content: string;
  @Column({ type: 'jsonb', nullable: true }) metadata?: Record<string, any>;
  @Column({ type: 'timestamp' }) sent_at: Date;
  @Column({ type: 'timestamp', nullable: true }) delivered_at?: Date;
  @Column({ type: 'timestamp', nullable: true }) read_at?: Date;
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  markDelivered(): void {
    this.delivered_at = new Date();
    this.updated_at = new Date();
  }

  markRead(): void {
    this.read_at = new Date();
    this.updated_at = new Date();
  }

  isDelivered(): boolean {
    return !!this.delivered_at;
  }

  isRead(): boolean {
    return !!this.read_at;
  }

  isSystemMessage(): boolean {
    return this.message_type === MessageType.SYSTEM;
  }

  static create(props: {
    conversationId: string;
    senderId: string;
    messageType: MessageType;
    content: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }): Partial<Message> {
    const sentAt = new Date();
    return {
      conversation_id: props.conversationId,
      sender_id: props.senderId,
      message_type: props.messageType,
      content: props.content,
      session_id: props.sessionId,
      metadata: props.metadata,
      sent_at: sentAt,
      created_at: sentAt,
      updated_at: sentAt,
    };
  }
}