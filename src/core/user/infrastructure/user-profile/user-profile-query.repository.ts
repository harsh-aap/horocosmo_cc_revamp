import { Injectable } from '@nestjs/common';
import { UserProfileBaseRepository } from './base-user-profile.repository';
import { UserProfileQueryPort } from '../../application/interfaces/user-profile/user-profile-query.interface';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';

@Injectable()
export class UserProfileQueryRepository
  extends UserProfileBaseRepository
  implements UserProfileQueryPort
{
  async findTopRatedProfiles(minRating: number, limit: number = 10): Promise<UserProfile[]> {
    return this.repo.find({
      where: {
        average_rating: minRating, // Note: This is a basic filter
      },
      order: {
        average_rating: 'DESC',
        total_ratings: 'DESC',
      },
      take: limit,
    });
  }

  // INHERITED METHODS:
  // - findById()
  // - findByUserId()
  // - getProfileStats()
}