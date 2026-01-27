import { Injectable } from '@nestjs/common';
import { BillingTransactionBaseRepository } from './billing-transaction-base.repository';
import { BillingTransactionManagementPort } from '../application/interfaces/billing-transaction-management.interface';
import { BillingTransaction, TransactionType, BillingStatus } from 'src/infrastructure/database/entities/billing-transaction.entity';

@Injectable()
export class BillingTransactionManagementRepository
    extends BillingTransactionBaseRepository
    implements BillingTransactionManagementPort {
    async createTransaction(props: {
        userId: string;
        transactionType: TransactionType;
        amount: number;
        sessionId?: string;
        description?: string;
        externalTransactionId?: string;
    }): Promise<BillingTransaction> {
        return this.create({
            user_id: props.userId,
            transaction_type: props.transactionType,
            amount: props.amount,
            session_id: props.sessionId,
            description: props.description,
            external_transaction_id: props.externalTransactionId,
            currency: 'INR',
            status: BillingStatus.PENDING,
            created_at: new Date(),
        });
    }

    async markCompleted(id: string): Promise<BillingTransaction> {
        const transaction = await this.findById(id);
        if (!transaction) throw new Error('Transaction not found');

        transaction.markCompleted();
        return this.save(transaction);
    }

    async markFailed(id: string): Promise<BillingTransaction> {
        const transaction = await this.findById(id);
        if (!transaction) throw new Error('Transaction not found');

        transaction.markFailed();
        return this.save(transaction);
    }

    async findPendingByUser(userId: string): Promise<BillingTransaction[]> {
        return this.repo.find({
            where: {
                user_id: userId,
                status: BillingStatus.PENDING,
            },
            order: { created_at: 'ASC' },
        });
    }
}