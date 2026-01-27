import { Inject, Injectable, Logger } from '@nestjs/common';
import { BILLING_TRANSACTION_MANAGEMENT_PORT, type BillingTransactionManagementPort } from '../interfaces/billing-transaction-management.interface';
import { TransactionType } from 'src/infrastructure/database/entities/billing-transaction.entity';

@Injectable()
export class CreateBillingTransactionUseCase {
  private readonly logger = new Logger(CreateBillingTransactionUseCase.name);

  constructor(
    @Inject(BILLING_TRANSACTION_MANAGEMENT_PORT)
    private readonly billingTransactionRepo: BillingTransactionManagementPort,
  ) {}

  async execute(props: {
    userId: string;
    transactionType: TransactionType;
    amount: number;
    sessionId?: string;
    description?: string;
    externalTransactionId?: string;
  }) {
    try {
      this.logger.log(`Creating billing transaction for user ${props.userId}`);

      const transaction = await this.billingTransactionRepo.createTransaction(props);

      return {
        id: transaction.id,
        userId: transaction.user_id,
        transactionType: transaction.transaction_type,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.created_at,
      };
    } catch (error) {
      this.logger.error(`Error creating billing transaction: ${error.message}`, error.stack);
      throw error;
    }
  }
}