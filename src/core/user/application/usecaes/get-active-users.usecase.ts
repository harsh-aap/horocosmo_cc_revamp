import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  USER_LOOKUP_PORT,
  type UserLookupPort,
} from '../interfaces/user-lookup.interface';
import { User } from 'src/infrastructure/database/entities/user.entity';

@Injectable()
export class GetActiveUsersUseCase {
  private readonly logger = new Logger(GetActiveUsersUseCase.name);
  constructor(
    @Inject(USER_LOOKUP_PORT)
    private readonly userLookupPort: UserLookupPort,
  ) {}

  async execute(): Promise<User[]> {
    try {
      const users = await this.userLookupPort.findActiveUsers();
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to get active users: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
