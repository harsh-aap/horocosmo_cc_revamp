import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';

/**
 * Symbol used for dependency injection.
 */
export const WALLET_QUERY_PORT = Symbol('WALLET_QUERY_PORT');

/**
 * WalletQueryPort interface
 */
export interface WalletQueryPort {
  findById(id: string): Promise<Wallet | null>;
  findByUserId(userId: string): Promise<Wallet | null>;
  getBalance(userId: string): Promise<{
    current_balance: number;
    available_balance: number;
    held_balance: number;
    currency: string;
    status: string;
  } | null>;
}