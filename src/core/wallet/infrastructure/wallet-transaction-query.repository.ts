import { Injectable } from '@nestjs/common';
import { WalletTransactionBaseRepository } from './wallet-transaction-base.repository';
import { WalletTransactionQueryPort } from '../../wallet/application/interfaces/wallet-transaction-query.interface';

@Injectable()
export class WalletTransactionQueryRepository
  extends WalletTransactionBaseRepository
  implements WalletTransactionQueryPort {
  // Inherits all methods from base repository
}