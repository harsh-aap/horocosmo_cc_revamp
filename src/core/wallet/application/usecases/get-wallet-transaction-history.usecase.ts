import { Inject, Injectable, Logger } from '@nestjs/common';
import { WALLET_TRANSACTION_QUERY_PORT, type WalletTransactionQueryPort } from '../interfaces/wallet-transaction-query.interface';

@Injectable()
export class GetWalletTransactionHistoryUseCase {
    private readonly logger = new Logger(GetWalletTransactionHistoryUseCase.name);

    constructor(
        @Inject(WALLET_TRANSACTION_QUERY_PORT)
        private readonly walletTransactionRepo: WalletTransactionQueryPort,
    ) { }

    async execute(walletId: string, limit: number = 20): Promise<{
        transactions: any[];
        totalCount: number;
    }> {
        try {
            this.logger.log(`Getting transaction history for wallet ${walletId}`);

            const [transactions, totalCount] = await Promise.all([
                this.walletTransactionRepo.findByWalletId(walletId, limit),
                this.walletTransactionRepo.getTransactionCount(walletId),
            ]);

            return {
                transactions: transactions.map(t => ({
                    id: t.id,
                    type: t.transaction_type,
                    amount: t.amount,
                    balanceBefore: t.balance_before,
                    balanceAfter: t.balance_after,
                    referenceId: t.reference_id,
                    description: t.description,
                    createdAt: t.created_at,
                })),
                totalCount,
            };
        } catch (error) {
            this.logger.error(`Error getting wallet transaction history: ${error.message}`, error.stack);
            throw error;
        }
    }
}