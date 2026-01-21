import { Inject, Injectable, Logger } from '@nestjs/common';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';
import { WALLET_MANAGEMENT_PORT, type WalletManagementPort } from '../interfaces/wallet-management.interface';

export interface HoldFundsInput {
  userId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class HoldFundsUseCase {
  private readonly logger = new Logger(HoldFundsUseCase.name);

  constructor(
    @Inject(WALLET_MANAGEMENT_PORT)
    private readonly walletManagementPort: WalletManagementPort,
  ) {}

  async execute(input: HoldFundsInput): Promise<Wallet> {
    this.logger.debug(`Holding ${input.amount} funds for user ${input.userId}`);

    try {
      const wallet = await this.walletManagementPort.holdFunds(input);

      this.logger.debug(`Funds held successfully for user ${input.userId}`);
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to hold funds for user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}