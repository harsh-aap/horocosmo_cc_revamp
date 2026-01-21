import { Inject, Injectable, Logger } from '@nestjs/common';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';
import { WALLET_MANAGEMENT_PORT, type WalletManagementPort } from '../interfaces/wallet-management.interface';

export interface CreateWalletInput {
  userId: string;
  initialBalance?: number;
}

@Injectable()
export class CreateWalletUseCase {
  private readonly logger = new Logger(CreateWalletUseCase.name);

  constructor(
    @Inject(WALLET_MANAGEMENT_PORT)
    private readonly walletManagementPort: WalletManagementPort,
  ) {}

  async execute(input: CreateWalletInput): Promise<Wallet> {
    this.logger.debug(`Creating wallet for user ${input.userId}`);

    try {
      const wallet = await this.walletManagementPort.createWallet(
        input.userId,
        input.initialBalance,
      );

      this.logger.debug(`Wallet created for user ${input.userId}`);
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to create wallet for user ${input.userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}