import { Injectable } from '@nestjs/common';
import { WalletBaseRepository } from './wallet-base.repository';
import { WalletQueryPort } from '../application/interfaces/wallet-query.interface';

@Injectable()
export class WalletQueryRepository
  extends WalletBaseRepository
  implements WalletQueryPort
{
  // All methods inherited from base repository
}