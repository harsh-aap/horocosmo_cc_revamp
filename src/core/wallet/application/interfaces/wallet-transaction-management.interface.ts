import { WalletTransaction, WalletTransactionType } from 'src/infrastructure/database/entities/wallet-transaction.entity';

export const WALLET_TRANSACTION_MANAGEMENT_PORT = Symbol('WALLET_TRANSACTION_MANAGEMENT_PORT');

export interface WalletTransactionManagementPort {
  createTransaction(props: {
    walletId: string;
    transactionType: WalletTransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    billingTransactionId?: string;
    referenceId?: string;
    description?: string;
  }): Promise<WalletTransaction>;
}