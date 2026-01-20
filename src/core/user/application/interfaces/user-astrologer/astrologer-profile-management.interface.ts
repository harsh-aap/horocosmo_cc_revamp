import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';

/**
 * Symbol used for dependency injection.
 * Identifies the AstrologerProfileManagementPort interface implementation in the DI container.
 */
export const ASTROLOGER_PROFILE_MANAGEMENT_PORT = Symbol('ASTROLOGER_PROFILE_MANAGEMENT_PORT');

/**
 * Input type for updating astrologer business profile.
 */
export interface UpdateAstrologerProfileInput {
  chat_rate_per_minute?: number;
  call_rate_per_minute?: number;
  max_concurrent_sessions?: number;
  specializations?: string[];
}

/**
 * Input type for updating astrologer rates.
 */
export interface UpdateRatesInput {
  chat_rate_per_minute?: number;
  call_rate_per_minute?: number;
}

/**
 * AstrologerProfileManagementPort interface
 *
 * Defines write operations for AstrologerProfile data.
 * Handles creation, updates, and business logic for astrologer profiles.
 */
export interface AstrologerProfileManagementPort {
  /**
   * Create a new astrologer business profile.
   * @param astrologerId - ID of the astrologer user this profile belongs to
   * @param profileData - Initial business profile data
   * @returns The created AstrologerProfile entity
   */
  createProfile(
    astrologerId: string,
    profileData: {
      chatRatePerMinute: number;
      callRatePerMinute: number;
      maxConcurrentSessions?: number;
      specializations?: string[];
    }
  ): Promise<AstrologerProfile>;

  /**
   * Find an astrologer profile by astrologer user ID (for management operations).
   * @param astrologerId - Astrologer User ID
   * @returns The AstrologerProfile entity if found, otherwise null
   */
  findByAstrologerId(astrologerId: string): Promise<AstrologerProfile | null>;

  /**
   * Update business profile information.
   * @param astrologerId - Astrologer User ID
   * @param updates - Business profile data to update
   * @returns The updated AstrologerProfile entity
   */
  updateProfile(astrologerId: string, updates: UpdateAstrologerProfileInput): Promise<AstrologerProfile>;

  /**
   * Update consultation rates.
   * @param astrologerId - Astrologer User ID
   * @param rates - New rates to set
   * @returns The updated AstrologerProfile entity
   */
  updateRates(astrologerId: string, rates: UpdateRatesInput): Promise<AstrologerProfile>;

  /**
   * Update astrologer's last active timestamp.
   * @param astrologerId - Astrologer User ID
   * @returns The updated AstrologerProfile entity
   */
  updateLastActive(astrologerId: string): Promise<AstrologerProfile>;

  /**
   * Update monthly statistics for an astrologer.
   * @param astrologerId - Astrologer User ID
   * @param sessionsCount - Number of sessions this month
   * @param rating - Average rating this month
   * @returns The updated AstrologerProfile entity
   */
  updateMonthlyStats(
    astrologerId: string,
    sessionsCount: number,
    rating: number
  ): Promise<AstrologerProfile>;

  /**
   * Check if an astrologer can handle more sessions.
   * @param astrologerId - Astrologer User ID
   * @param currentSessions - Number of current active sessions
   * @returns Boolean indicating if more sessions can be handled
   */
  canHandleMoreSessions(astrologerId: string, currentSessions: number): Promise<boolean>;

  /**
   * Calculate chat consultation cost.
   * @param astrologerId - Astrologer User ID
   * @param minutes - Number of minutes
   * @returns Total cost
   */
  calculateChatCost(astrologerId: string, minutes: number): Promise<number>;

  /**
   * Calculate call consultation cost.
   * @param astrologerId - Astrologer User ID
   * @param minutes - Number of minutes
   * @returns Total cost
   */
  calculateCallCost(astrologerId: string, minutes: number): Promise<number>;

  /**
   * Save profile changes to the database.
   * @param profile - AstrologerProfile entity to save
   * @returns The saved AstrologerProfile entity
   */
  save(profile: AstrologerProfile): Promise<AstrologerProfile>;
}