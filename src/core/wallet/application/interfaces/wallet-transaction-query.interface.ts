import { WalletTransaction } from 'src/infrastructure/database/entities/wallet-transaction.entity';

export const WALLET_TRANSACTION_QUERY_PORT = Symbol('WALLET_TRANSACTION_QUERY_PORT');

export interface WalletTransactionQueryPort {
  findByWalletId(walletId: string, limit?: number): Promise<WalletTransaction[]>;
  findById(id: string): Promise<WalletTransaction | null>;
  findByReferenceId(referenceId: string): Promise<WalletTransaction | null>;
  getTransactionCount(walletId: string): Promise<number>;
}