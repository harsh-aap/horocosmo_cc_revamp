import { Inject, Injectable, Logger } from '@nestjs/common';
import { BILLING_TRANSACTION_MANAGEMENT_PORT, type BillingTransactionManagementPort } from '../interfaces/billing-transaction-management.interface';

@Injectable()
export class MarkBillingTransactionFailedUseCase {
    private readonly logger = new Logger(MarkBillingTransactionFailedUseCase.name);

    constructor(
        @Inject(BILLING_TRANSACTION_MANAGEMENT_PORT)
        private readonly billingTransactionRepo: BillingTransactionManagementPort,
    ) { }

    async execute(transactionId: string) {
        try {
            this.logger.log(`Marking billing transaction ${transactionId} as failed`);

            const transaction = await this.billingTransactionRepo.markFailed(transactionId);

            return {
                id: transaction.id,
                status: transaction.status,
                processedAt: transaction.processed_at,
            };
        } catch (error) {
            this.logger.error(`Error marking transaction failed: ${error.message}`, error.stack);
            throw error;
        }
    }
}