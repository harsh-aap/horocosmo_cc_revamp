import { User } from 'src/infrastructure/database/entities/user.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the UserLookupPort interface implementation in the NestJS DI container.
 */
export const USER_QUERY_PORT = Symbol('USER_QUERY_PORT');

/**
 * UserLookupPort interface
 *
 * Defines read-only operations for fetching user data.
 * This port abstracts the retrieval of users from the database or external systems,
 * allowing the application layer to remain decoupled from the infrastructure layer.
 */
export interface UserQueryPort {
  /**
   * Find a single user by their unique ID.
   *
   * @param id - User ID
   * @returns The User entity if found, otherwise null
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find multiple users by their IDs.
   *
   * @param ids - Array of User IDs
   * @returns Array of User entities that match the given IDs
   */
  findByIds(ids: string[]): Promise<User[]>;

  /**
   * Find a user by their email address.
   *
   * @param email - User's email
   * @returns The User entity if found, otherwise null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieve all active users.
   *
   * @returns Array of User entities with active status
   */
  findActiveUsers(): Promise<User[]>;

  /**
   * Retrieve all active astrologers.
   *
   * @returns Array of User entities with active status and type astrologer
   */
  findActiveAstrologers(): Promise<User[]>;

  /**
   * Get the total count of users in the system.
   *
   * @returns Number of users
   */
  countUsers(): Promise<number>;

  /**
   * Get the total count of astrologers in the system.
   *
   * @returns Number of astrologers
   */
  countAstrologers(): Promise<number>;
}
