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
    // ✅ Correct return type
    try {
      this.logger.debug(`Sync user with external ID: ${input.externalId}`);

      let user = await this.userPort.findByExternalId(input.externalId);

      if (user) {
        // Update existing user
        this.logger.debug(`Updating existing user: ${user.id}`);
        user.updateProfile({
          name: input.name,
          phone: input.phone,
        });
        user.markAsSynced();
        const updatedUser = await this.userPort.save(user);
        this.logger.log(`Successfully updated user: ${updatedUser.id}`);
        return updatedUser;
      } else {
        // Create new user
        this.logger.debug(
          `Creating new user with external ID: ${input.externalId}`,
        );

        const newUserData = User.create({
          name: input.name,
          email: input.email || undefined, // ✅ Handle optional email
          externalId: input.externalId,
          type: input.type,
          phone: input.phone,
        });

        const newUser = await this.userPort.create(newUserData);
        newUser.markAsSynced();

        // ✅ Remove duplicate save - create() already saves
        this.logger.log(`Successfully created user: ${newUser.id}`);
        return newUser;
      }
    } catch (error) {
      this.logger.error(`Failed to sync user ${input.externalId}`, error);
      throw error; // ✅ Re-throw error
    }
  }
}