import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { Wallet } from './wallet.entity';
import { BillingTransaction } from './billing-transaction.entity';

export enum WalletTransactionType { DEPOSIT = 'deposit', WITHDRAWAL = 'withdrawal', FEE = 'fee', REFUND = 'refund' }

@Entity('wallet_transactions')
@Check(`"transaction_type" IN ('deposit', 'withdrawal', 'fee', 'refund')`)
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  
  @Column('uuid') 
  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' }) // 🔗 Many:1 with Wallet
  @JoinColumn({ name: 'wallet_id' }) 
  @Index() 
  wallet_id: string;
  
  @Column('uuid', { nullable: true }) 
  @ManyToOne(() => BillingTransaction, { onDelete: 'SET NULL' }) // 🔗 Many:1 with BillingTransaction (optional)
  @JoinColumn({ name: 'billing_transaction_id' }) 
  @Index() 
  billing_transaction_id?: string;
  
  @Column({ type: 'enum', enum: WalletTransactionType }) transaction_type: WalletTransactionType;
  @Column('decimal', { precision: 10, scale: 2 }) amount: number;
  @Column('decimal', { precision: 10, scale: 2 }) balance_before: number;
  @Column('decimal', { precision: 10, scale: 2 }) balance_after: number;
  @Column({ type: 'varchar', length: 255, nullable: true }) reference_id?: string;
  @Column({ type: 'text', nullable: true }) description?: string;
  
  @CreateDateColumn() created_at: Date;

  // Business Methods
  getBalanceChange(): number {
    return this.balance_after - this.balance_before;
  }

  isDebit(): boolean {
    return this.getBalanceChange() < 0;
  }

  isCredit(): boolean {
    return this.getBalanceChange() > 0;
  }

  static create(props: {
    walletId: string;
    transactionType: WalletTransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    billingTransactionId?: string;
    referenceId?: string;
    description?: string;
  }): Partial<WalletTransaction> {
    return {
      wallet_id: props.walletId,
      billing_transaction_id: props.billingTransactionId,
      transaction_type: props.transactionType,
      amount: props.amount,
      balance_before: props.balanceBefore,
      balance_after: props.balanceAfter,
      reference_id: props.referenceId,
      description: props.description,
      created_at: new Date(),
    };
  }
}