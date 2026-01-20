import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index, Check } from 'typeorm';
import { User } from './user.entity';

export enum WalletStatus { ACTIVE = 'active', FROZEN = 'frozen', SUSPENDED = 'suspended' }

@Entity('wallets')
@Check(`"status" IN ('active', 'frozen', 'suspended')`)
export class Wallet {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @OneToOne(() => User, { onDelete: 'CASCADE' }) // 🔗 1:1 with User
  @JoinColumn({ name: 'user_id' }) 
  @Index() 
  user_id: string;
  
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) current_balance: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) available_balance: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) held_balance: number;
  @Column({ type: 'varchar', length: 3, default: 'INR' }) currency: string;
  
  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE }) status: WalletStatus;
  @Column({ type: 'timestamp', nullable: true }) last_transaction_at?: Date;
  
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;

  // Business Methods
  canAfford(amount: number): boolean {
    return this.available_balance >= amount;
  }

  holdBalance(amount: number): boolean {
    if (this.available_balance >= amount) {
      this.available_balance -= amount;
      this.held_balance += amount;
      this.last_transaction_at = new Date();
      this.updated_at = new Date();
      return true;
    }
    return false;
  }

  releaseHold(amount: number): void {
    if (this.held_balance >= amount) {
      this.held_balance -= amount;
      this.available_balance += amount;
      this.last_transaction_at = new Date();
      this.updated_at = new Date();
    }
  }

  deductFromHold(amount: number): boolean {
    if (this.held_balance >= amount) {
      this.held_balance -= amount;
      this.current_balance -= amount;
      this.last_transaction_at = new Date();
      this.updated_at = new Date();
      return true;
    }
    return false;
  }

  addBalance(amount: number): void {
    this.current_balance += amount;
    this.available_balance += amount;
    this.last_transaction_at = new Date();
    this.updated_at = new Date();
  }

  getTotalBalance(): number {
    return this.available_balance + this.held_balance;
  }

  isActive(): boolean {
    return this.status === WalletStatus.ACTIVE;
  }

  freeze(): void {
    this.status = WalletStatus.FROZEN;
    this.updated_at = new Date();
  }

  suspend(): void {
    this.status = WalletStatus.SUSPENDED;
    this.updated_at = new Date();
  }

  static create(props: { userId: string; initialBalance?: number; currency?: string }): Partial<Wallet> {
    return {
      user_id: props.userId,
      current_balance: props.initialBalance || 0,
      available_balance: props.initialBalance || 0,
      held_balance: 0,
      currency: props.currency || 'INR',
      status: WalletStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}