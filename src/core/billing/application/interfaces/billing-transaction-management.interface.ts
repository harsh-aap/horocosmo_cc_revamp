import { BillingTransaction, TransactionType } from 'src/infrastructure/database/entities/billing-transaction.entity';

export const BILLING_TRANSACTION_MANAGEMENT_PORT = Symbol('BILLING_TRANSACTION_MANAGEMENT_PORT');

export interface BillingTransactionManagementPort {
  createTransaction(props: {
    userId: string;
    transactionType: TransactionType;
    amount: number;
    sessionId?: string;
    description?: string;
    externalTransactionId?: string;
  }): Promise<BillingTransaction>;

  markCompleted(id: string): Promise<BillingTransaction>;
  markFailed(id: string): Promise<BillingTransaction>;
  findPendingByUser(userId: string): Promise<BillingTransaction[]>;
}