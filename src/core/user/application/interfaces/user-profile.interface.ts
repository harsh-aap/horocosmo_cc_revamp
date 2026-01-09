import { User, UserStatus } from 'src/infrastructure/database/entities/user.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the UserProfilePort interface implementation in the DI container.
 */
export const USER_PROFILE_PORT = Symbol('USER_PROFILE_PORT');

/**
 * Input type for updating a user's profile.
 * Contains optional fields that can be updated for a user or astrologer.
 */
export interface UpdateProfileInput {
  name?: string;   // Optional full name update
  email?: string;  // Optional email update
}

/**
 * UserProfilePort interface
 *
 * Defines the contract for user profile operations.
 * Acts as an abstraction between the use case layer and persistence layer.
 */
export interface UserProfilePort {
  /**
   * Find a user by their internal ID for update
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
   * Update the profile of a specific user.
   * Uses UpdateProfileInput to modify only the provided fields.
   * @param userId - ID of the user to update
   * @param update - Partial profile data to update
   * @returns The updated User entity
   */
  updateProfile(userId: string, updates: UpdateProfileInput): Promise<User>;

  /**
   * Update the status of a specific user (e.g., active, inactive, suspended).
   * @param userId - ID of the user
   * @param status - New status to set
   * @returns The updated User entity
   */
  updateStatus(userId: string, status: UserStatus): Promise<User>;
}

