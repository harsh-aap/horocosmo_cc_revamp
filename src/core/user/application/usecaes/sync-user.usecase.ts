import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import {
  SYNC_USER_PORT,
  type SyncUserInput,
  type SyncUserPort,
} from '../interfaces/sync-user.interface';

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
      let user = await this.userPort.findByExternalId(input.externalId);

      if (user) {
        // If user exists, update the profile fields with the new data
        user.updateProfile({
          name: input.name,
          phone: input.phone,
        });

        // Mark the user as synced
        user.markAsSynced();

        // Save the updated user back to the database
        const updatedUser = await this.userPort.save(user);

        // Return the updated user
        return updatedUser;
      } else {
        // If user does not exist, prepare a new user entity
        const newUserData = User.create({
          name: input.name,
          email: input.email || undefined,
          externalId: input.externalId,
          type: input.type,
          phone: input.phone,
        });

        // Create the new user in the database
        const newUser = await this.userPort.create(newUserData);

        // Mark the new user as synced
        newUser.markAsSynced();

        // Return the newly created user
        return newUser;
      }
    } catch (error) {
      // If anything fails, log the error and rethrow
      this.logger.error(`Failed to sync user ${input.externalId}`, error);
      throw error;
    }
  }
}

