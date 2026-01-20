import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the UserProfileManagementPort interface implementation in the DI container.
 */
export const USER_PROFILE_MANAGEMENT_PORT = Symbol('USER_PROFILE_MANAGEMENT_PORT');

/**
 * Input type for updating user profile data.
 */
export interface UpdateProfileInput {
  bio?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}

/**
 * UserProfileManagementPort interface
 *
 * Defines write operations for UserProfile data.
 * Handles creation, updates, and statistics management for user profiles.
 */
export interface UserProfileManagementPort {
  /**
   * Create a new user profile.
   * @param userId - ID of the user this profile belongs to
   * @param profileData - Initial profile data
   * @returns The created UserProfile entity
   */
  createProfile(
    userId: string,
    profileData?: { bio?: string; avatar_url?: string }
  ): Promise<UserProfile>;

  /**
   * Find a user profile by user ID (for management operations).
   * @param userId - User ID
   * @returns The UserProfile entity if found, otherwise null
   */
  findByUserId(userId: string): Promise<UserProfile | null>;

  /**
   * Update profile information (bio, avatar, preferences).
   * @param userId - User ID
   * @param updates - Profile data to update
   * @returns The updated UserProfile entity
   */
  updateProfile(userId: string, updates: UpdateProfileInput): Promise<UserProfile>;

  /**
   * Add a rating to a user's profile and recalculate average.
   * @param userId - User ID being rated
   * @param rating - Rating value (typically 1-5)
   * @returns The updated UserProfile entity
   */
  addRating(userId: string, rating: number): Promise<UserProfile>;

  /**
   * Increment the total consultation count for a user.
   * @param userId - User ID
   * @returns The updated UserProfile entity
   */
  incrementConsultations(userId: string): Promise<UserProfile>;

  /**
   * Increment the completed consultation count for a user.
   * @param userId - User ID
   * @returns The updated UserProfile entity
   */
  incrementCompletedConsultations(userId: string): Promise<UserProfile>;

  /**
   * Get profile statistics for dashboard/analytics.
   * @param userId - User ID
   * @returns Statistics object
   */
  getStats(userId: string): Promise<{
    total_consultations: number;
    completed_consultations: number;
    average_rating: number;
    total_ratings: number;
  }>;

  /**
   * Save profile changes to the database.
   * @param profile - UserProfile entity to save
   * @returns The saved UserProfile entity
   */
  save(profile: UserProfile): Promise<UserProfile>;
}