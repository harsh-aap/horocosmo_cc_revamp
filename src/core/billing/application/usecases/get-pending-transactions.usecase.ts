import { Inject, Injectable, Logger } from '@nestjs/common';
import { BILLING_TRANSACTION_MANAGEMENT_PORT, type BillingTransactionManagementPort } from '../interfaces/billing-transaction-management.interface';
import { BILLING_TRANSACTION_QUERY_PORT, type BillingTransactionQueryPort } from '../interfaces/billing-transaction-query.interface';

@Injectable()
export class GetPendingTransactionsUseCase {
    private readonly logger = new Logger(GetPendingTransactionsUseCase.name);

    constructor(
        @Inject(BILLING_TRANSACTION_QUERY_PORT)
        private readonly billingQueryRepo: BillingTransactionQueryPort,
        @Inject(BILLING_TRANSACTION_MANAGEMENT_PORT)
        private readonly billingManagementRepo: BillingTransactionManagementPort,
    ) { }

    async execute(userId: string) {
        try {
            this.logger.log(`Getting pending transactions for user ${userId}`);
            const pendingTransactions = await this.billingManagementRepo.findPendingByUser(userId);
            return {
                transactions: pendingTransactions.map(t => ({
                    id: t.id,
                    type: t.transaction_type,
                    amount: t.amount,
                    currency: t.currency,
                    description: t.description,
                    sessionId: t.session_id,
                    createdAt: t.created_at,
                })),
                count: pendingTransactions.length,
            };
        } catch (error) {
            this.logger.error(`Error getting pending transactions: ${error.message}`, error.stack);
            throw error;
        }
    }
}