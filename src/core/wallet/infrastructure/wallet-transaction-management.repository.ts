import { Injectable } from '@nestjs/common';
import { WalletTransactionBaseRepository } from './wallet-transaction-base.repository';
import { WalletTransactionManagementPort } from '../../wallet/application/interfaces/wallet-transaction-management.interface';
import { WalletTransaction } from 'src/infrastructure/database/entities/wallet-transaction.entity';

@Injectable()
export class WalletTransactionManagementRepository
  extends WalletTransactionBaseRepository
  implements WalletTransactionManagementPort {
  async createTransaction(props: {
    walletId: string;
    transactionType: WalletTransaction['transaction_type'];
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    billingTransactionId?: string;
    referenceId?: string;
    description?: string;
  }): Promise<WalletTransaction> {
    return this.create(WalletTransaction.create({
      walletId: props.walletId,
      transactionType: props.transactionType,
      amount: props.amount,
      balanceBefore: props.balanceBefore,
      balanceAfter: props.balanceAfter,
      billingTransactionId: props.billingTransactionId,
      referenceId: props.referenceId,
      description: props.description,
    }));
  }
}