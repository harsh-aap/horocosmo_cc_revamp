import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletTransaction } from 'src/infrastructure/database/entities/wallet-transaction.entity';

@Injectable()
export class WalletTransactionBaseRepository {
  protected readonly logger = new Logger(WalletTransactionBaseRepository.name);

  constructor(
    @InjectRepository(WalletTransaction)
    protected readonly repo: Repository<WalletTransaction>,
  ) {}

  async findById(id: string): Promise<WalletTransaction | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByWalletId(walletId: string, limit: number = 50): Promise<WalletTransaction[]> {
    return this.repo.find({
      where: { wallet_id: walletId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async findByReferenceId(referenceId: string): Promise<WalletTransaction | null> {
    return this.repo.findOne({ where: { reference_id: referenceId } });
  }

  async getTransactionCount(walletId: string): Promise<number> {
    return this.repo.count({ where: { wallet_id: walletId } });
  }

  async save(transaction: WalletTransaction): Promise<WalletTransaction> {
    return this.repo.save(transaction);
  }

  async create(transactionData: Partial<WalletTransaction>): Promise<WalletTransaction> {
    const transaction = this.repo.create(transactionData);
    return this.repo.save(transaction);
  }
}