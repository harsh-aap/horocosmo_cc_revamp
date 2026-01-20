import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';

/**
 * UserProfileBaseRepository
 *
 * Provides common read/write operations for UserProfile entities.
 * This base class is extended by specialized repositories to avoid code duplication.
 */
@Injectable()
export class UserProfileBaseRepository {
  protected readonly logger = new Logger(UserProfileBaseRepository.name);

  constructor(
    @InjectRepository(UserProfile)
    protected readonly repo: Repository<UserProfile>,
  ) {}

  /**
   * Find a user profile by its ID.
   * @param id - Profile ID
   * @returns The UserProfile entity if found, otherwise null
   */
  async findById(id: string): Promise<UserProfile | null> {
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Find a user profile by the associated user ID.
   * @param userId - User ID
   * @returns The UserProfile entity if found, otherwise null
   */
  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.repo.findOne({ where: { user_id: userId } });
  }

  /**
   * Get profile statistics for a user.
   * @param userId - User ID
   * @returns Profile statistics or null if profile not found
   */
  async getProfileStats(userId: string): Promise<{
    total_consultations: number;
    completed_consultations: number;
    average_rating: number;
    total_ratings: number;
  } | null> {
    const profile = await this.findByUserId(userId);
    if (!profile) return null;

    return {
      total_consultations: profile.total_consultations,
      completed_consultations: profile.completed_consultations,
      average_rating: profile.average_rating,
      total_ratings: profile.total_ratings,
    };
  }

  /**
   * Persist a UserProfile entity to the database.
   * Handles both creation and updates.
   * @param profile - UserProfile entity to save
   * @returns The saved UserProfile entity
   */
  async save(profile: UserProfile): Promise<UserProfile> {
    return this.repo.save(profile);
  }

  /**
   * Create a new UserProfile in the database.
   * @param profileData - Partial profile data
   * @returns The created UserProfile entity
   */
  async create(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.repo.create(profileData);
    return this.repo.save(profile);
  }
}