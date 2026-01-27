import { Inject, Injectable, Logger } from '@nestjs/common';
import { type BillingTransactionQueryPort, BILLING_TRANSACTION_QUERY_PORT } from '../interfaces/billing-transaction-query.interface';

@Injectable()
export class GetBillingHistoryUseCase {
    private readonly logger = new Logger(GetBillingHistoryUseCase.name);

    constructor(
        @Inject(BILLING_TRANSACTION_QUERY_PORT)
        private readonly billingTransactionRepo: BillingTransactionQueryPort,
    ) { }

    async execute(userId: string, limit: number = 20) {
        try {
            this.logger.log(`Getting billing history for user ${userId}`);

            const [transactions, totalCount] = await Promise.all([
                this.billingTransactionRepo.findByUserId(userId, limit),
                this.billingTransactionRepo.getUserTransactionCount(userId),
            ]);

            return {
                transactions: transactions.map(t => ({
                    id: t.id,
                    type: t.transaction_type,
                    amount: t.amount,
                    currency: t.currency,
                    status: t.status,
                    description: t.description,
                    externalTransactionId: t.external_transaction_id,
                    sessionId: t.session_id,
                    createdAt: t.created_at,
                    processedAt: t.processed_at,
                })),
                totalCount,
            };
        } catch (error) {
            this.logger.error(`Error getting billing history: ${error.message}`, error.stack);
            throw error;
        }
    }
}