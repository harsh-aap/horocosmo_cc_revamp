import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';

// Interfaces
import { WALLET_QUERY_PORT } from './application/interfaces/wallet-query.interface';
import { WALLET_MANAGEMENT_PORT } from './application/interfaces/wallet-management.interface';

// Repositories
import { WalletBaseRepository } from './infrastructure/wallet-base.repository';
import { WalletQueryRepository } from './infrastructure/wallet-query.repository';
import { WalletManagementRepository } from './infrastructure/wallet-management.repository';

// Use Cases
import { CreateWalletUseCase } from './application/usecases/create-wallet.usecase';
import { GetWalletBalanceUseCase } from './application/usecases/get-wallet-balance.usecase';
import { HoldFundsUseCase } from './application/usecases/hold-funds.usecase';
import { ReleaseFundsUseCase } from './application/usecases/release-funds.usecase';
import { AddFundsUseCase } from './application/usecases/add-funds.usecase';
import { DeductFundsUseCase } from './application/usecases/dedduct-funds.usecase';

// Controller
import { WalletController } from './presentation/wallet.controller';

/**
 * WalletModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
  ],
  controllers: [
    WalletController,
  ],
  providers: [
    // Repositories
    WalletBaseRepository,
    {
      provide: WALLET_QUERY_PORT,
      useClass: WalletQueryRepository,
    },
    {
      provide: WALLET_MANAGEMENT_PORT,
      useClass: WalletManagementRepository,
    },

    // Use Cases
    CreateWalletUseCase,
    GetWalletBalanceUseCase,
    HoldFundsUseCase,
    ReleaseFundsUseCase,
    AddFundsUseCase,
    DeductFundsUseCase,
  ],
  exports: [
    WALLET_QUERY_PORT,
    WALLET_MANAGEMENT_PORT,
    CreateWalletUseCase,
    GetWalletBalanceUseCase,
    HoldFundsUseCase,
    ReleaseFundsUseCase,
    AddFundsUseCase,
    DeductFundsUseCase,
  ],
})
export class WalletModule { }