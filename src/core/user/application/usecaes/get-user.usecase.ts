import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  User,
} from 'src/infrastructure/database/entities/user.entity';
import {
  USER_LOOKUP_PORT,
  type UserLookupPort,
} from '../interfaces/user-lookup.interface';

@Injectable()
export class GetUserProfileUseCase {
  private readonly logger = new Logger(GetUserProfileUseCase.name);

  constructor(
    @Inject(USER_LOOKUP_PORT)
    private readonly userLookUpPort: UserLookupPort,
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
