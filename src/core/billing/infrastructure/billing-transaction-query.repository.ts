import { Injectable } from '@nestjs/common';
import { BillingTransactionBaseRepository } from './billing-transaction-base.repository';
import { BillingTransactionQueryPort } from '../application/interfaces/billing-transaction-query.interface';

@Injectable()
export class BillingTransactionQueryRepository
  extends BillingTransactionBaseRepository
  implements BillingTransactionQueryPort
{
  // Inherits all methods from base repository
}