import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';

/**
 * AstrologerProfileBaseRepository
 *
 * Provides common read/write operations for AstrologerProfile entities.
 * This base class is extended by specialized repositories to avoid code duplication.
 */
@Injectable()
export class AstrologerProfileBaseRepository {
  protected readonly logger = new Logger(AstrologerProfileBaseRepository.name);

  constructor(
    @InjectRepository(AstrologerProfile)
    protected readonly repo: Repository<AstrologerProfile>,
  ) {}

  /**
   * Find an astrologer profile by its ID.
   * @param id - Profile ID
   * @returns The AstrologerProfile entity if found, otherwise null
   */
  async findById(id: string): Promise<AstrologerProfile | null> {
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Find an astrologer profile by the associated astrologer user ID.
   * @param astrologerId - Astrologer User ID
   * @returns The AstrologerProfile entity if found, otherwise null
   */
  async findByAstrologerId(astrologerId: string): Promise<AstrologerProfile | null> {
    return this.repo.findOne({ where: { astrologer_id: astrologerId } });
  }

  /**
   * Get business profile information for an astrologer.
   * @param astrologerId - Astrologer User ID
   * @returns Business profile data or null if not found
   */
  async getBusinessProfile(astrologerId: string): Promise<{
    chat_rate_per_minute: number;
    call_rate_per_minute: number;
    max_concurrent_sessions: number;
    specializations?: string[];
    monthly_sessions: number;
    monthly_rating: number;
  } | null> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) return null;

    return {
      chat_rate_per_minute: profile.chat_rate_per_minute,
      call_rate_per_minute: profile.call_rate_per_minute,
      max_concurrent_sessions: profile.max_concurrent_sessions,
      specializations: profile.specializations,
      monthly_sessions: profile.monthly_sessions,
      monthly_rating: profile.monthly_rating,
    };
  }

  /**
   * Persist an AstrologerProfile entity to the database.
   * Handles both creation and updates.
   * @param profile - AstrologerProfile entity to save
   * @returns The saved AstrologerProfile entity
   */
  async save(profile: AstrologerProfile): Promise<AstrologerProfile> {
    return this.repo.save(profile);
  }

  /**
   * Create a new AstrologerProfile in the database.
   * @param profileData - Partial profile data
   * @returns The created AstrologerProfile entity
   */
  async create(profileData: Partial<AstrologerProfile>): Promise<AstrologerProfile> {
    const profile = this.repo.create(profileData);
    return this.repo.save(profile);
  }
}