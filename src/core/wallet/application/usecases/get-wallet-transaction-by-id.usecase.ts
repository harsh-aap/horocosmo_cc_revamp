import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WALLET_TRANSACTION_QUERY_PORT, type WalletTransactionQueryPort } from '../../application/interfaces/wallet-transaction-query.interface';

@Injectable()
export class GetWalletTransactionByIdUseCase {
  private readonly logger = new Logger(GetWalletTransactionByIdUseCase.name);

  constructor(
    @Inject(WALLET_TRANSACTION_QUERY_PORT)
    private readonly walletTransactionRepo: WalletTransactionQueryPort,
  ) {}

  async execute(transactionId: string): Promise<{
    id: string;
    walletId: string;
    type: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    billingTransactionId?: string;
    referenceId?: string;
    description?: string;
    createdAt: Date;
  }> {
    try {
      this.logger.log(`Getting wallet transaction ${transactionId}`);

      const transaction = await this.walletTransactionRepo.findById(transactionId);
      if (!transaction) {
        throw new NotFoundException(`Wallet transaction ${transactionId} not found`);
      }

      return {
        id: transaction.id,
        walletId: transaction.wallet_id,
        type: transaction.transaction_type,
        amount: transaction.amount,
        balanceBefore: transaction.balance_before,
        balanceAfter: transaction.balance_after,
        billingTransactionId: transaction.billing_transaction_id,
        referenceId: transaction.reference_id,
        description: transaction.description,
        createdAt: transaction.created_at,
      };
    } catch (error) {
      this.logger.error(`Error getting wallet transaction: ${error.message}`, error.stack);
      throw error;
    }
  }
}