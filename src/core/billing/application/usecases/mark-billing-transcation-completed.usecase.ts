import { Inject, Injectable, Logger } from '@nestjs/common';
import { BILLING_TRANSACTION_MANAGEMENT_PORT, type BillingTransactionManagementPort } from '../interfaces/billing-transaction-management.interface';

@Injectable()
export class MarkBillingTransactionCompletedUseCase {
  private readonly logger = new Logger(MarkBillingTransactionCompletedUseCase.name);

  constructor(
    @Inject(BILLING_TRANSACTION_MANAGEMENT_PORT)
    private readonly billingTransactionRepo: BillingTransactionManagementPort,
  ) {}

  async execute(transactionId: string) {
    try {
      this.logger.log(`Marking billing transaction ${transactionId} as completed`);

      const transaction = await this.billingTransactionRepo.markCompleted(transactionId);

      return {
        id: transaction.id,
        status: transaction.status,
        processedAt: transaction.processed_at,
      };
    } catch (error) {
      this.logger.error(`Error marking transaction completed: ${error.message}`, error.stack);
      throw error;
    }
  }
}