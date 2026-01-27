import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WALLET_TRANSACTION_QUERY_PORT, type WalletTransactionQueryPort } from '../interfaces/wallet-transaction-query.interface';

@Injectable()
export class GetWalletTransactionByReferenceUseCase {
  private readonly logger = new Logger(GetWalletTransactionByReferenceUseCase.name);

  constructor(
    @Inject(WALLET_TRANSACTION_QUERY_PORT)
    private readonly walletTransactionRepo: WalletTransactionQueryPort,
  ) {}

  async execute(referenceId: string): Promise<{
    id: string;
    walletId: string;
    type: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    billingTransactionId?: string;
    description?: string;
    createdAt: Date;
  }> {
    try {
      this.logger.log(`Getting wallet transaction by reference ${referenceId}`);

      const transaction = await this.walletTransactionRepo.findByReferenceId(referenceId);
      if (!transaction) {
        throw new NotFoundException(`Wallet transaction with reference ${referenceId} not found`);
      }

      return {
        id: transaction.id,
        walletId: transaction.wallet_id,
        type: transaction.transaction_type,
        amount: transaction.amount,
        balanceBefore: transaction.balance_before,
        balanceAfter: transaction.balance_after,
        billingTransactionId: transaction.billing_transaction_id,
        description: transaction.description,
        createdAt: transaction.created_at,
      };
    } catch (error) {
      this.logger.error(`Error getting wallet transaction by reference: ${error.message}`, error.stack);
      throw error;
    }
  }
}