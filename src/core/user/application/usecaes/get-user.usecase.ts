import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  USER_QUERY_PORT,
  type UserQueryPort,
} from '../interfaces/user-query.interface';

@Injectable()
export class GetUserProfileUseCase {
  private readonly logger = new Logger(GetUserProfileUseCase.name);

  constructor(
    @Inject(USER_QUERY_PORT)
    private readonly userLookUpPort: UserQueryPort,
  ) {}

  async execute(userId: string): Promise<User> {
    try {
      const user = await this.userLookUpPort.findById(userId);

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user;
    } catch (error) {
      // Only log if it's not the NotFoundException we expect
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`Unexpected error fetching user ${userId}`, error);
      }
      throw error;
    }
  }
}
