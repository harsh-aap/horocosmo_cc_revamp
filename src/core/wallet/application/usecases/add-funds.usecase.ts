import { Inject, Injectable, Logger } from '@nestjs/common';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';
import { WALLET_MANAGEMENT_PORT, type WalletManagementPort } from '../interfaces/wallet-management.interface';

export interface AddFundsInput {
  userId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class AddFundsUseCase {
  private readonly logger = new Logger(AddFundsUseCase.name);

  constructor(
    @Inject(WALLET_MANAGEMENT_PORT)
    private readonly walletManagementPort: WalletManagementPort,
  ) {}

  async execute(input: AddFundsInput): Promise<Wallet> {
    this.logger.debug(`Adding ${input.amount} funds to user ${input.userId}`);

    try {
      const wallet = await this.walletManagementPort.addFunds(input);

      this.logger.debug(`Funds added successfully to user ${input.userId}`);
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to add funds to user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}