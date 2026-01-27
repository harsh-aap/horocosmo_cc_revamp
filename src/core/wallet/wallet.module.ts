import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';
import { WalletTransaction } from 'src/infrastructure/database/entities/wallet-transaction.entity';

// Interfaces
import { WALLET_QUERY_PORT } from './application/interfaces/wallet-query.interface';
import { WALLET_MANAGEMENT_PORT } from './application/interfaces/wallet-management.interface';
import { WALLET_TRANSACTION_QUERY_PORT } from './application/interfaces/wallet-transaction-query.interface';
import { WALLET_TRANSACTION_MANAGEMENT_PORT } from './application/interfaces/wallet-transaction-management.interface';

// Repositories
import { WalletBaseRepository } from './infrastructure/wallet-base.repository';
import { WalletQueryRepository } from './infrastructure/wallet-query.repository';
import { WalletManagementRepository } from './infrastructure/wallet-management.repository';
import { WalletTransactionBaseRepository } from './infrastructure/wallet-transaction-base.repository';
import { WalletTransactionManagementRepository } from './infrastructure/wallet-transaction-management.repository';
import { WalletTransactionQueryRepository } from './infrastructure/wallet-transaction-query.repository';

// Use Cases
import { CreateWalletUseCase } from './application/usecases/create-wallet.usecase';
import { GetWalletBalanceUseCase } from './application/usecases/get-wallet-balance.usecase';
import { HoldFundsUseCase } from './application/usecases/hold-funds.usecase';
import { ReleaseFundsUseCase } from './application/usecases/release-funds.usecase';
import { AddFundsUseCase } from './application/usecases/add-funds.usecase';
import { DeductFundsUseCase } from './application/usecases/dedduct-funds.usecase';
import { GetWalletTransactionByIdUseCase } from './application/usecases/get-wallet-transaction-by-id.usecase';
import { GetWalletTransactionByReferenceUseCase } from './application/usecases/get-wallet-transaction-by-reference.usecase';
import { GetWalletTransactionHistoryUseCase } from './application/usecases/get-wallet-transaction-history.usecase';

// Controller
import { WalletController } from './presentation/wallet.controller';

/**
 * WalletModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
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
    WalletTransactionBaseRepository,
    {
      provide: WALLET_TRANSACTION_QUERY_PORT,
      useClass: WalletTransactionQueryRepository
    },
    {
      provide: WALLET_TRANSACTION_MANAGEMENT_PORT,
      useClass: WalletTransactionManagementRepository
    },

    // Use Cases
    CreateWalletUseCase,
    GetWalletBalanceUseCase,
    HoldFundsUseCase,
    ReleaseFundsUseCase,
    AddFundsUseCase,
    DeductFundsUseCase,
    GetWalletTransactionByIdUseCase,
    GetWalletTransactionByReferenceUseCase,
    GetWalletTransactionHistoryUseCase,
  ],

  exports: [
    WALLET_QUERY_PORT,
    WALLET_MANAGEMENT_PORT,
    WALLET_TRANSACTION_QUERY_PORT,
    WALLET_TRANSACTION_MANAGEMENT_PORT,
    CreateWalletUseCase,
    GetWalletBalanceUseCase,
    HoldFundsUseCase,
    ReleaseFundsUseCase,
    AddFundsUseCase,
    DeductFundsUseCase,
    GetWalletTransactionByIdUseCase,
    GetWalletTransactionByReferenceUseCase,
    GetWalletTransactionHistoryUseCase,
  ],
})
export class WalletModule { }