import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the UserProfileQueryPort interface implementation in the DI container.
 */
export const USER_PROFILE_QUERY_PORT = Symbol('USER_PROFILE_QUERY_PORT');

/**
 * UserProfileQueryPort interface
 *
 * Defines read-only operations for UserProfile data.
 * Handles retrieval of profile information, statistics, and ratings.
 */
export interface UserProfileQueryPort {
  /**
   * Find a user profile by its ID.
   * @param id - Profile ID
   * @returns The UserProfile entity if found, otherwise null
   */
  findById(id: string): Promise<UserProfile | null>;

  /**
   * Find a user profile by the associated user ID.
   * @param userId - User ID
   * @returns The UserProfile entity if found, otherwise null
   */
  findByUserId(userId: string): Promise<UserProfile | null>;

  /**
   * Get profile statistics for a user.
   * @param userId - User ID
   * @returns Profile statistics or null if not found
   */
  getProfileStats(userId: string): Promise<{
    total_consultations: number;
    completed_consultations: number;
    average_rating: number;
    total_ratings: number;
  } | null>;

  /**
   * Find profiles with high ratings (for featured astrologers).
   * @param minRating - Minimum average rating threshold
   * @param limit - Maximum number of results
   * @returns Array of highly-rated user profiles
   */
  findTopRatedProfiles(minRating: number, limit?: number): Promise<UserProfile[]>;
}