import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/infrastructure/database/entities/user.entity';
import { SyncUserPort } from '../application/interfaces/sync-user.interface';

@Injectable()
export class UserRepository implements SyncUserPort {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByExternalId(externalId: string): Promise<User | null> {
    this.logger.debug(`Finding user by external ID: ${externalId}`);
    return this.repo.findOne({ where: { external_id: externalId } });
  }

  async save(user: User): Promise<User> {
    this.logger.debug(`Saving user: ${user.id}`);
    return this.repo.save(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.debug('Creating new user');
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }
}