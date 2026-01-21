import { Inject, Injectable, Logger } from '@nestjs/common';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';
import { WALLET_MANAGEMENT_PORT, type WalletManagementPort } from '../interfaces/wallet-management.interface';

export interface DeductFundsInput {
  userId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class DeductFundsUseCase {
  private readonly logger = new Logger(DeductFundsUseCase.name);

  constructor(
    @Inject(WALLET_MANAGEMENT_PORT)
    private readonly walletManagementPort: WalletManagementPort,
  ) {}

  async execute(input: DeductFundsInput): Promise<Wallet> {
    this.logger.debug(`Deducting ${input.amount} funds from user ${input.userId}`);

    try {
      const wallet = await this.walletManagementPort.deductFunds(input);

      this.logger.debug(`Funds deducted successfully from user ${input.userId}`);
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to deduct funds from user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}