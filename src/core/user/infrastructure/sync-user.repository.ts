import { Injectable } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/user.entity';
import { SyncUserPort } from '../application/interfaces/sync-user.interface';
import { BaseUserRepository } from './base-user.repository';

/**
 * UserRepository is the concrete implementation of SyncUserPort.
 * Handles database operations for User entities using TypeORM.
 */
@Injectable()
export class SyncUserRepository
  extends BaseUserRepository
  implements SyncUserPort
{
  /**
   * Find a user by their external ID.
   * @param externalId - The external system ID for the user
   * @returns The User entity if found, otherwise null
   */
  async findByExternalId(externalId: string): Promise<User | null> {
    // Use TypeORM's findOne with a where clause
    return this.repo.findOne({ where: { external_id: externalId } });
  }

  /**
   * Create a new User in the database.
   * Accepts partial user data, creates an entity, and persists it.
   * @param userData - Partial user data to create a new user
   * @returns The newly created User entity
   */
  async create(userData: Partial<User>): Promise<User> {
    // Create a new User entity from the partial data
    const user = this.repo.create(userData);
    // Persist the new user to the database
    return this.repo.save(user);
  }
}
