import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  USER_QUERY_PORT,
  type UserQueryPort,
} from '../../interfaces/user/user-query.interface';
import { User } from 'src/infrastructure/database/entities/user.entity';

@Injectable()
export class GetActiveUsersUseCase {
  private readonly logger = new Logger(GetActiveUsersUseCase.name);
  constructor(
    @Inject(USER_QUERY_PORT)
    private readonly userQueryPort: UserQueryPort,
  ) {}

  async execute(): Promise<User[]> {
    try {
      const users = await this.userQueryPort.findActiveUsers();
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
