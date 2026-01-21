import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';

/**
 * Symbol used for dependency injection.
 */
export const WALLET_MANAGEMENT_PORT = Symbol('WALLET_MANAGEMENT_PORT');

export interface HoldFundsInput {
    userId: string;
    amount: number;
    description?: string;
}

export interface ReleaseFundsInput {
    userId: string;
    amount: number;
    description?: string;
}

export interface AddFundsInput {
    userId: string;
    amount: number;
    description?: string;
}

export interface DeductFundsInput {
    userId: string;
    amount: number;
    description?: string;
}

/**
 * WalletManagementPort interface
 */
export interface WalletManagementPort {
    createWallet(userId: string, initialBalance?: number): Promise<Wallet>;
    holdFunds(input: HoldFundsInput): Promise<Wallet>;
    releaseFunds(input: ReleaseFundsInput): Promise<Wallet>;
    addFunds(input: AddFundsInput): Promise<Wallet>;
    deductFunds(input: DeductFundsInput): Promise<Wallet>;
    canAfford(userId: string, amount: number): Promise<boolean>;
    getBalance(userId: string): Promise<{
        current_balance: number;
        available_balance: number;
        held_balance: number;
        currency: string;
        status: string;
    } | null>;
    save(wallet: Wallet): Promise<Wallet>;
}