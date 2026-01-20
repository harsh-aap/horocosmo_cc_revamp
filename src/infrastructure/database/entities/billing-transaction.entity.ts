import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { User } from './user.entity';
import { ConsultationSession } from './consultation-session.entity';

export enum TransactionType { CREDIT = 'credit', DEBIT = 'debit', REFUND = 'refund', HOLD = 'hold', RELEASE = 'release' }
export enum BillingStatus { PENDING = 'pending', COMPLETED = 'completed', FAILED = 'failed' }

@Entity('billing_transactions')
@Check(`"transaction_type" IN ('credit', 'debit', 'refund', 'hold', 'release')`)
@Check(`"status" IN ('pending', 'completed', 'failed')`)
export class BillingTransaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 Many:1 with User
  @JoinColumn({ name: 'user_id' }) 
  @Index() 
  user_id: string;
  
  @Column('uuid', { nullable: true }) 
  @ManyToOne(() => ConsultationSession, { onDelete: 'SET NULL' }) // 🔗 Many:1 with Session (optional)
  @JoinColumn({ name: 'session_id' }) 
  @Index() 
  session_id?: string;
  
  @Column({ type: 'enum', enum: TransactionType }) @Index() transaction_type: TransactionType;
  @Column('decimal', { precision: 10, scale: 2 }) amount: number;
  @Column({ type: 'varchar', length: 3, default: 'INR' }) currency: string;
  @Column({ type: 'enum', enum: BillingStatus, default: BillingStatus.PENDING }) status: BillingStatus;
  @Column({ type: 'varchar', length: 255, nullable: true }) external_transaction_id?: string;
  @Column({ type: 'text', nullable: true }) description?: string;
  @Column({ type: 'timestamp', nullable: true }) processed_at?: Date;
  
  @CreateDateColumn() created_at: Date;

  // Business Methods
  markCompleted(): void {
    this.status = BillingStatus.COMPLETED;
    this.processed_at = new Date();
  }

  markFailed(): void {
    this.status = BillingStatus.FAILED;
    this.processed_at = new Date();
  }

  isCompleted(): boolean {
    return this.status === BillingStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === BillingStatus.PENDING;
  }

  static createDebit(props: {
    userId: string;
    amount: number;
    sessionId?: string;
    description?: string;
  }): Partial<BillingTransaction> {
    return {
      user_id: props.userId,
      session_id: props.sessionId,
      transaction_type: TransactionType.DEBIT,
      amount: props.amount,
      currency: 'INR',
      status: BillingStatus.PENDING,
      description: props.description,
      created_at: new Date(),
    };
  }

  static createCredit(props: {
    userId: string;
    amount: number;
    description?: string;
    externalTransactionId?: string;
  }): Partial<BillingTransaction> {
    return {
      user_id: props.userId,
      transaction_type: TransactionType.CREDIT,
      amount: props.amount,
      currency: 'INR',
      status: BillingStatus.PENDING,
      external_transaction_id: props.externalTransactionId,
      description: props.description,
      created_at: new Date(),
    };
  }
}