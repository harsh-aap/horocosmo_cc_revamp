import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileBaseRepository } from './base-user-profile.repository';
import {
  UserProfileManagementPort,
  UpdateProfileInput,
} from '../../application/interfaces/user-profile/user-profile-management.interface';
import { UserProfile } from 'src/infrastructure/database/entities/user-profile.entity';

@Injectable()
export class UserProfileManagementRepository
  extends UserProfileBaseRepository
  implements UserProfileManagementPort
{
  async createProfile(
    userId: string,
    profileData?: { bio?: string; avatar_url?: string }
  ): Promise<UserProfile> {
    // Check if profile already exists
    const existingProfile = await this.findByUserId(userId);
    if (existingProfile) {
      throw new Error(`Profile already exists for user ${userId}`);
    }

    // Create new profile
    return this.create(UserProfile.create({
      userId,
      bio: profileData?.bio,
      avatar_url: profileData?.avatar_url,
    }));
  }

  async updateProfile(userId: string, updates: UpdateProfileInput): Promise<UserProfile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    profile.updateProfile(updates);
    return this.save(profile);
  }

  async addRating(userId: string, rating: number): Promise<UserProfile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    profile.addRating(rating);
    return this.save(profile);
  }

  async incrementConsultations(userId: string): Promise<UserProfile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    profile.incrementConsultations();
    return this.save(profile);
  }

  async incrementCompletedConsultations(userId: string): Promise<UserProfile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    profile.incrementCompletedConsultations();
    return this.save(profile);
  }

  async getStats(userId: string): Promise<{
    total_consultations: number;
    completed_consultations: number;
    average_rating: number;
    total_ratings: number;
  }> {
    const stats = await this.getProfileStats(userId);
    if (!stats) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }
    return stats;
  }

  // INHERITED: findByUserId(), save()
}