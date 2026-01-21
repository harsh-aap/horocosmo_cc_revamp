import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';

/**
 * WalletBaseRepository
 */
@Injectable()
export class WalletBaseRepository {
  protected readonly logger = new Logger(WalletBaseRepository.name);

  constructor(
    @InjectRepository(Wallet)
    protected readonly repo: Repository<Wallet>,
  ) {}

  async findById(id: string): Promise<Wallet | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.repo.findOne({ where: { user_id: userId } });
  }

  async getBalance(userId: string): Promise<{
    current_balance: number;
    available_balance: number;
    held_balance: number;
    currency: string;
    status: string;
  } | null> {
    const wallet = await this.findByUserId(userId);
    if (!wallet) return null;

    return {
      current_balance: wallet.current_balance,
      available_balance: wallet.available_balance,
      held_balance: wallet.held_balance,
      currency: wallet.currency,
      status: wallet.status,
    };
  }

  async save(wallet: Wallet): Promise<Wallet> {
    return this.repo.save(wallet);
  }

  async create(walletData: Partial<Wallet>): Promise<Wallet> {
    const wallet = this.repo.create(walletData);
    return this.repo.save(wallet);
  }
}