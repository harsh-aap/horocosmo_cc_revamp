import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletBaseRepository } from './wallet-base.repository';
import {
  WalletManagementPort,
  HoldFundsInput,
  ReleaseFundsInput,
  AddFundsInput,
  DeductFundsInput,
} from '../application/interfaces/wallet-management.interface';
import { Wallet } from 'src/infrastructure/database/entities/wallet.entity';

@Injectable()
export class WalletManagementRepository
  extends WalletBaseRepository
  implements WalletManagementPort
{
  async createWallet(userId: string, initialBalance: number = 0): Promise<Wallet> {
    const existingWallet = await this.findByUserId(userId);
    if (existingWallet) {
      throw new Error(`Wallet already exists for user ${userId}`);
    }

    return this.create(Wallet.create({
      userId,
      initialBalance,
    }));
  }

  async holdFunds(input: HoldFundsInput): Promise<Wallet> {
    const wallet = await this.findByUserId(input.userId);
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${input.userId}`);
    }

    const success = wallet.holdBalance(input.amount);
    if (!success) {
      throw new Error(`Insufficient funds to hold ${input.amount}`);
    }

    return this.save(wallet);
  }

  async releaseFunds(input: ReleaseFundsInput): Promise<Wallet> {
    const wallet = await this.findByUserId(input.userId);
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${input.userId}`);
    }

    wallet.releaseHold(input.amount);
    return this.save(wallet);
  }

  async addFunds(input: AddFundsInput): Promise<Wallet> {
    const wallet = await this.findByUserId(input.userId);
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${input.userId}`);
    }

    wallet.addBalance(input.amount);
    return this.save(wallet);
  }

  async deductFunds(input: DeductFundsInput): Promise<Wallet> {
    const wallet = await this.findByUserId(input.userId);
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${input.userId}`);
    }

    const success = wallet.deductFromHold(input.amount);
    if (!success) {
      throw new Error(`Cannot deduct ${input.amount} from held funds`);
    }

    return this.save(wallet);
  }

  async canAfford(userId: string, amount: number): Promise<boolean> {
    const wallet = await this.findByUserId(userId);
    if (!wallet) return false;

    return wallet.canAfford(amount);
  }

  // getBalance() inherited from base repository
  // save() inherited from base repository
}