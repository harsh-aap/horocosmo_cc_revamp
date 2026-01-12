import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  type UserLookupPort,
  USER_LOOKUP_PORT,
} from '../interfaces/user-lookup.interface';

@Injectable()
export class GetActiveAstrologersUseCase {
  private readonly logger = new Logger(GetActiveAstrologersUseCase.name);

  constructor(
    @Inject(USER_LOOKUP_PORT)
    private readonly userLookupPort: UserLookupPort,
  ) {}

  async execute(): Promise<User[]> {
    this.logger.debug('Getting active astrologers');

    try {
      const astrologers = await this.userLookupPort.findActiveAstrologers();

      this.logger.debug(`Found ${astrologers.length} active astrologers`);
      return astrologers;
    } catch (error) {
      this.logger.error(
        `Failed to get active astrologers: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
