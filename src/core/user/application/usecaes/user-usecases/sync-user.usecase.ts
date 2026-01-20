import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  SYNC_USER_PORT,
  type SyncUserInput,
  type SyncUserPort,
} from '../../interfaces/user/sync-user.interface';

@Injectable()
export class SyncUserUseCase {
  private readonly logger = new Logger(SyncUserUseCase.name);

  constructor(
    @Inject(SYNC_USER_PORT)
    private readonly userPort: SyncUserPort,
  ) {}

  async execute(input: SyncUserInput): Promise<User> {
    try {
      // Try to find an existing user by externalId
      let existingUser = await this.userPort.findByExternalId(input.externalId);
      if (existingUser) {
        existingUser.markAsSynced();
        return this.userPort.save(existingUser);
      }

      // create a new user
      const user = User.create({
        name: input.name,
        email: input.email ? input.email : '',
        phone: input.phone,
        type: input.type,
        externalId: input.externalId,
      });

      const savedUser = await this.userPort.create(user);
      return savedUser;
    } catch (error) {
      // If anything fails, log the error and rethrow
      this.logger.error(`Failed to sync user ${input.externalId}`, error);
      throw error;
    }
  }
}
