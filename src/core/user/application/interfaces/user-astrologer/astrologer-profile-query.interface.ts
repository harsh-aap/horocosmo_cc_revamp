import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the AstrologerProfileQueryPort interface implementation in the DI container.
 */
export const ASTROLOGER_PROFILE_QUERY_PORT = Symbol('ASTROLOGER_PROFILE_QUERY_PORT');

/**
 * AstrologerProfileQueryPort interface
 *
 * Defines read-only operations for AstrologerProfile data.
 * Handles retrieval of business profile information, rates, availability, and performance metrics.
 */
export interface AstrologerProfileQueryPort {
  /**
   * Find an astrologer profile by its ID.
   * @param id - Profile ID
   * @returns The AstrologerProfile entity if found, otherwise null
   */
  findById(id: string): Promise<AstrologerProfile | null>;

  /**
   * Find an astrologer profile by the associated astrologer user ID.
   * @param astrologerId - Astrologer User ID
   * @returns The AstrologerProfile entity if found, otherwise null
   */
  findByAstrologerId(astrologerId: string): Promise<AstrologerProfile | null>;

  /**
   * Get business profile information for an astrologer.
   * @param astrologerId - Astrologer User ID
   * @returns Business profile data or null if not found
   */
  getBusinessProfile(astrologerId: string): Promise<{
    chat_rate_per_minute: number;
    call_rate_per_minute: number;
    max_concurrent_sessions: number;
    specializations?: string[];
    monthly_sessions: number;
    monthly_rating: number;
  } | null>;

  /**
   * Find available astrologers (not busy, within capacity).
   * @param currentTime - Current timestamp for availability check
   * @returns Array of available astrologer profiles
   */
  findAvailableAstrologers(currentTime?: Date): Promise<AstrologerProfile[]>;

  /**
   * Find astrologers by specialization.
   * @param specialization - Specialization to search for
   * @param limit - Maximum number of results
   * @returns Array of matching astrologer profiles
   */
  findBySpecialization(specialization: string, limit?: number): Promise<AstrologerProfile[]>;

  /**
   * Get astrologers sorted by rating.
   * @param minRating - Minimum rating threshold
   * @param limit - Maximum number of results
   * @returns Array of top-rated astrologer profiles
   */
  findTopRatedAstrologers(minRating?: number, limit?: number): Promise<AstrologerProfile[]>;
}