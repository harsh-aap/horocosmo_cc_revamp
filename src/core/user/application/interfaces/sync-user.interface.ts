import {
  User,
  UserType,
} from 'src/infrastructure/database/entities/user.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the SyncUserPort interface implementation in the NestJS DI container.
 */
export const SYNC_USER_PORT = Symbol('SYNC_USER_PORT');

/**
 * Input type for syncing a user.
 *
 * Represents the data required to create a new user or update an existing user
 * in the system. Typically comes from an external system or backend.
 */
export interface SyncUserInput {
  externalId: string; // Unique external identifier for the user (e.g., from a third-party system)
  name: string; // Full name of the user
  email?: string | null; // Optional email address
  type: UserType; // Type of user (e.g., astrologer, client, etc.)
  phone: string; // Phone number of the user
}

/**
 * SyncUserPort interface
 *
 * Defines the contract for user-related persistence operations.
 * Serves as an abstraction between the application (use case) layer
 * and the infrastructure (database or external system) layer.
 */
export interface SyncUserPort {
  /**
   * Find a user by their external ID.
   *
   * @param externalId - External identifier of the user
   * @returns The User entity if found, otherwise null
   */
  findByExternalId(externalId: string): Promise<User | null>;

  /**
   * Save changes to an existing user entity.
   *
   * Typically used after updating profile information or marking the user as synced.
   *
   * @param user - The User entity to save
   * @returns The saved User entity
   */
  save(user: User): Promise<User>;

  /**
   * Create a new user in the database.
   *
   * Accepts partial user data to construct a new User entity and persist it.
   *
   * @param userData - Partial data to create the user
   * @returns The newly created User entity
   */
  create(userData: Partial<User>): Promise<User>;
}
