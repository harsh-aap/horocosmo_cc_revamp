import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingTransaction } from 'src/infrastructure/database/entities/billing-transaction.entity';

// Interfaces
import { BILLING_TRANSACTION_QUERY_PORT } from './application/interfaces/billing-transaction-query.interface';
import { BILLING_TRANSACTION_MANAGEMENT_PORT } from './application/interfaces/billing-transaction-management.interface';

// Repositories
import { BillingTransactionBaseRepository } from './infrastructure/billing-transaction-base.repository';
import { BillingTransactionQueryRepository } from './infrastructure/billing-transaction-query.repository';
import { BillingTransactionManagementRepository } from './infrastructure/billing-transaction-management.repository';

// Use Cases
import { CreateBillingTransactionUseCase } from './application/usecases/create-billing-transaction.usecase';
import { GetBillingHistoryUseCase } from './application/usecases/get-billing-history.usecase';
import { GetPendingTransactionsUseCase } from './application/usecases/get-pending-transactions.usecase';
import { MarkBillingTransactionCompletedUseCase } from './application/usecases/mark-billing-transcation-completed.usecase';
import { MarkBillingTransactionFailedUseCase } from './application/usecases/mark-billing-transcation-failed.usecase';

// Controller
import { BillingController } from './presentation/billing.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([BillingTransaction]),
    ],
    controllers: [
        BillingController,
    ],
    providers: [
        // Repositories
        BillingTransactionBaseRepository,
        {
            provide: BILLING_TRANSACTION_QUERY_PORT,
            useClass: BillingTransactionQueryRepository,
        },
        {
            provide: BILLING_TRANSACTION_MANAGEMENT_PORT,
            useClass: BillingTransactionManagementRepository,
        },

        // Use Cases
        CreateBillingTransactionUseCase,
        GetBillingHistoryUseCase,
        GetPendingTransactionsUseCase,
        MarkBillingTransactionCompletedUseCase,
        MarkBillingTransactionFailedUseCase,
    ],
    exports: [
        BILLING_TRANSACTION_QUERY_PORT,
        BILLING_TRANSACTION_MANAGEMENT_PORT,
        CreateBillingTransactionUseCase,
        GetBillingHistoryUseCase,
        GetPendingTransactionsUseCase,
        MarkBillingTransactionCompletedUseCase,
        MarkBillingTransactionFailedUseCase,
    ],
})
export class BillingModule { }