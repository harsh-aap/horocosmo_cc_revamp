import { Injectable } from '@nestjs/common';
import { AstrologerProfileBaseRepository } from './astrologer-profile-base.repository';
import { AstrologerProfileQueryPort } from '../../application/interfaces/user-astrologer/astrologer-profile-query.interface';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';

@Injectable()
export class AstrologerProfileQueryRepository
  extends AstrologerProfileBaseRepository
  implements AstrologerProfileQueryPort
{
  async findAvailableAstrologers(currentTime: Date = new Date()): Promise<AstrologerProfile[]> {
    // Find astrologers who were active within the last 24 hours
    const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

    return this.repo.find({
      where: {
        last_active_at: {
          $gte: twentyFourHoursAgo
        } as any
      },
      order: {
        last_active_at: 'DESC',
      },
    });
  }

  async findBySpecialization(specialization: string, limit: number = 10): Promise<AstrologerProfile[]> {
    return this.repo
      .createQueryBuilder('profile')
      .where(':specialization = ANY(profile.specializations)', { specialization })
      .orderBy('profile.monthly_rating', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findTopRatedAstrologers(minRating: number = 4.0, limit: number = 10): Promise<AstrologerProfile[]> {
    return this.repo.find({
      where: {
        monthly_rating: {
          $gte: minRating
        } as any
      },
      order: {
        monthly_rating: 'DESC',
        monthly_sessions: 'DESC',
      },
      take: limit,
    });
  }

  // INHERITED METHODS:
  // - findById()
  // - findByAstrologerId()
  // - getBusinessProfile()
}