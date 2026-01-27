import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingTransaction, BillingStatus } from 'src/infrastructure/database/entities/billing-transaction.entity';

@Injectable()
export class BillingTransactionBaseRepository {
    protected readonly logger = new Logger(BillingTransactionBaseRepository.name);

    constructor(
        @InjectRepository(BillingTransaction)
        protected readonly repo: Repository<BillingTransaction>,
    ) { }

    async findById(id: string): Promise<BillingTransaction | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByUserId(userId: string, limit: number = 50): Promise<BillingTransaction[]> {
        return this.repo.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: limit,
        });
    }

    async findBySessionId(sessionId: string): Promise<BillingTransaction[]> {
        return this.repo.find({
            where: { session_id: sessionId },
            order: { created_at: 'DESC' },
        });
    }

    async findPendingTransactions(): Promise<BillingTransaction[]> {
        return this.repo.find({
            where: { status: BillingStatus.PENDING },
            order: { created_at: 'ASC' },
        });
    }

    async getUserTransactionCount(userId: string): Promise<number> {
        return this.repo.count({ where: { user_id: userId } });
    }

    async save(transaction: BillingTransaction): Promise<BillingTransaction> {
        return this.repo.save(transaction);
    }

    async create(transactionData: Partial<BillingTransaction>): Promise<BillingTransaction> {
        const transaction = this.repo.create(transactionData);
        return this.repo.save(transaction);
    }
}