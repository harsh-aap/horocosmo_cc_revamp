import {
  User,
  UserStatus,
  ConsultationAvailability,
} from 'src/infrastructure/database/entities/user.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the UserManagementPort interface implementation in the DI container.
 */
export const USER_MANAGEMENT_PORT = Symbol('USER_MANAGEMENT_PORT');

/**
 * Input type for updating a user's core profile details.
 * Contains optional fields that can be updated for a user or astrologer.
 */
export interface UpdateCoreDetailsInput {
  name?: string;           // Optional full name update
  email?: string;          // Optional email update
  bio?: string;           // Optional description/bio
  avatar_url?: string;    // Profile picture URL
}

/**
 * UserManagementPort interface
 *
 * Defines the contract for core user management operations.
 * Handles updates to the main User entity (identity, status, availability).
 * Separated from profile data (balance, stats) which goes to UserProfile entity.
 */
export interface UserManagementPort {
  /**
   * Find a user by their internal ID for management operations
   * @param id - User ID
   * @returns The User entity if found, otherwise null
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by their email address.
   * Useful for checking uniqueness or login operations.
   * @param email - User email
   * @returns The User entity if found, otherwise null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieve all active astrologers.
   * Can be used to display available astrologers in the system.
   * @returns An array of User entities with active status and type astrologer
   */
  findActiveAstrologers(): Promise<User[]>;

  /**
   * Save changes to a user entity.
   * Typically used after updating a user's profile or status.
   * @param user - User entity to save
   * @returns The saved User entity
   */
  save(user: User): Promise<User>;

  /**
   * Update the core profile details of a specific user.
   * Uses UpdateCoreDetailsInput to modify only the provided fields.
   * @param userId - ID of the user to update
   * @param updates - Partial profile data to update
   * @returns The updated User entity
   */
  updateUserCoreDetails(
    userId: string,
    updates: UpdateCoreDetailsInput,
  ): Promise<User>;

  /**
   * Update the account status of a specific user (e.g., active, inactive, suspended).
   * @param userId - ID of the user
   * @param status - New account status to set
   * @returns The updated User entity
   */
  updateStatus(userId: string, status: UserStatus): Promise<User>;

  /**
   * Update the consultation availability of a user.
   * @param userId - ID of the user
   * @param availability - New availability status
   * @returns The updated User entity
   */
  updateAvailability(userId: string, availability: ConsultationAvailability): Promise<User>;

  /**
   * Mark a user as available for consultations.
   * @param userId - ID of the user
   * @returns The updated User entity
   */
  markUserAvailable(userId: string): Promise<User>;

  /**
   * Mark a user as unavailable for consultations.
   * @param userId - ID of the user
   * @returns The updated User entity
   */
  markUserUnavailable(userId: string): Promise<User>;

  /**
   * Mark a user as offline (logged out).
   * @param userId - ID of the user
   * @returns The updated User entity
   */
  markUserOffline(userId: string): Promise<User>;
}