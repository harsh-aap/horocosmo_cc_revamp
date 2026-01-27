import { BillingTransaction } from 'src/infrastructure/database/entities/billing-transaction.entity';

export const BILLING_TRANSACTION_QUERY_PORT = Symbol('BILLING_TRANSACTION_QUERY_PORT');

export interface BillingTransactionQueryPort {
  findById(id: string): Promise<BillingTransaction | null>;
  findByUserId(userId: string, limit?: number): Promise<BillingTransaction[]>;
  findBySessionId(sessionId: string): Promise<BillingTransaction[]>;
  findPendingTransactions(): Promise<BillingTransaction[]>;
  getUserTransactionCount(userId: string): Promise<number>;
}