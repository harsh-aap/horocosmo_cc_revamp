import { Inject, Injectable, Logger } from '@nestjs/common';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';
import { WALLET_MANAGEMENT_PORT, type WalletManagementPort } from '../interfaces/wallet-management.interface';

export interface ReleaseFundsInput {
  userId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class ReleaseFundsUseCase {
  private readonly logger = new Logger(ReleaseFundsUseCase.name);

  constructor(
    @Inject(WALLET_MANAGEMENT_PORT)
    private readonly walletManagementPort: WalletManagementPort,
  ) {}

  async execute(input: ReleaseFundsInput): Promise<Wallet> {
    this.logger.debug(`Releasing ${input.amount} funds for user ${input.userId}`);

    try {
      const wallet = await this.walletManagementPort.releaseFunds(input);

      this.logger.debug(`Funds released successfully for user ${input.userId}`);
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to release funds for user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}