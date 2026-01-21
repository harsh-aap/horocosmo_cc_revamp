import { Inject, Injectable, Logger } from '@nestjs/common';
import { WALLET_QUERY_PORT, type WalletQueryPort } from '../interfaces/wallet-query.interface';

@Injectable()
export class GetWalletBalanceUseCase {
  private readonly logger = new Logger(GetWalletBalanceUseCase.name);

  constructor(
    @Inject(WALLET_QUERY_PORT)
    private readonly walletQueryPort: WalletQueryPort,
  ) {}

  async execute(userId: string) {
    this.logger.debug(`Getting wallet balance for user ${userId}`);

    try {
      const balance = await this.walletQueryPort.getBalance(userId);

      if (balance) {
        this.logger.debug(`Balance retrieved for user ${userId}`);
      } else {
        this.logger.debug(`No wallet found for user ${userId}`);
      }

      return balance;
    } catch (error) {
      this.logger.error(
        `Failed to get wallet balance for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}