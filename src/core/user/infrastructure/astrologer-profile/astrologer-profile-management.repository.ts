import { Injectable, NotFoundException } from '@nestjs/common';
import { AstrologerProfileBaseRepository } from './astrologer-profile-base.repository';
import {
  AstrologerProfileManagementPort,
  UpdateAstrologerProfileInput,
  UpdateRatesInput,
} from '../../application/interfaces/user-astrologer/astrologer-profile-management.interface';
import { AstrologerProfile } from 'src/infrastructure/database/entities/astrologer-profile.entity';

@Injectable()
export class AstrologerProfileManagementRepository
  extends AstrologerProfileBaseRepository
  implements AstrologerProfileManagementPort
{
  async createProfile(
    astrologerId: string,
    profileData: {
      chatRatePerMinute: number;
      callRatePerMinute: number;
      maxConcurrentSessions?: number;
      specializations?: string[];
    }
  ): Promise<AstrologerProfile> {
    // Check if profile already exists
    const existingProfile = await this.findByAstrologerId(astrologerId);
    if (existingProfile) {
      throw new Error(`Astrologer profile already exists for user ${astrologerId}`);
    }

    // Create new profile
    return this.create(AstrologerProfile.create({
      astrologerId,
      chatRatePerMinute: profileData.chatRatePerMinute,
      callRatePerMinute: profileData.callRatePerMinute,
      maxConcurrentSessions: profileData.maxConcurrentSessions,
      specializations: profileData.specializations,
    }));
  }

  async updateProfile(astrologerId: string, updates: UpdateAstrologerProfileInput): Promise<AstrologerProfile> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) {
      throw new NotFoundException(`Astrologer profile not found for user ${astrologerId}`);
    }

    // Update fields
    if (updates.chat_rate_per_minute !== undefined) {
      profile.chat_rate_per_minute = updates.chat_rate_per_minute;
    }
    if (updates.call_rate_per_minute !== undefined) {
      profile.call_rate_per_minute = updates.call_rate_per_minute;
    }
    if (updates.max_concurrent_sessions !== undefined) {
      profile.max_concurrent_sessions = updates.max_concurrent_sessions;
    }
    if (updates.specializations !== undefined) {
      profile.specializations = updates.specializations;
    }

    profile.updated_at = new Date();
    return this.save(profile);
  }

  async updateRates(astrologerId: string, rates: UpdateRatesInput): Promise<AstrologerProfile> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) {
      throw new NotFoundException(`Astrologer profile not found for user ${astrologerId}`);
    }

    if (rates.chat_rate_per_minute !== undefined) {
      profile.chat_rate_per_minute = rates.chat_rate_per_minute;
    }
    if (rates.call_rate_per_minute !== undefined) {
      profile.call_rate_per_minute = rates.call_rate_per_minute;
    }

    profile.updated_at = new Date();
    return this.save(profile);
  }

  async updateLastActive(astrologerId: string): Promise<AstrologerProfile> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) {
      throw new NotFoundException(`Astrologer profile not found for user ${astrologerId}`);
    }

    profile.updateLastActive();
    return this.save(profile);
  }

  async updateMonthlyStats(
    astrologerId: string,
    sessionsCount: number,
    rating: number
  ): Promise<AstrologerProfile> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) {
      throw new NotFoundException(`Astrologer profile not found for user ${astrologerId}`);
    }

    profile.updateMonthlyStats(sessionsCount, rating);
    return this.save(profile);
  }

  async canHandleMoreSessions(astrologerId: string, currentSessions: number): Promise<boolean> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) return false;

    return profile.canHandleMoreSessions(currentSessions);
  }

  async calculateChatCost(astrologerId: string, minutes: number): Promise<number> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) {
      throw new NotFoundException(`Astrologer profile not found for user ${astrologerId}`);
    }

    return profile.calculateChatCost(minutes);
  }

  async calculateCallCost(astrologerId: string, minutes: number): Promise<number> {
    const profile = await this.findByAstrologerId(astrologerId);
    if (!profile) {
      throw new NotFoundException(`Astrologer profile not found for user ${astrologerId}`);
    }

    return profile.calculateCallCost(minutes);
  }

  // INHERITED: findByAstrologerId(), save()
}