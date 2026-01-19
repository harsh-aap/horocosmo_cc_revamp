import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUserRepository } from './base-user.repository';
import {
  UserManagementPort,
  UpdateCoreDetailsInput,
} from '../application/interfaces/user-management.interface';
import {
  UserStatus,
  User,
  ConsultationAvailability,
} from 'src/infrastructure/database/entities/user.entity';

@Injectable()
export class UserManagementRepository
  extends BaseUserRepository
  implements UserManagementPort
{
  async updateUserCoreDetails(
    userId: string,
    updates: UpdateCoreDetailsInput,
  ): Promise<User> {
    // getting user for the particular id here
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    // updating profile can only update
    user.updateProfile({
      name: updates.name,
      email: updates.email,
    });
    return this.save(user);
  }

  async updateStatus(userId: string, status: UserStatus): Promise<User> {
    // getting user for the particular id here
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.status = status;
    user.updated_at = new Date();
    return this.save(user); // INHERITED METHOD
  }

  async updateAvailability(
    userId: string,
    availability: ConsultationAvailability,
  ): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    switch (availability) {
      case ConsultationAvailability.AVAILABLE:
        user.markAvailable();
        break;
      case ConsultationAvailability.UNAVAILABLE:
        user.markUnavailable;
        break;
      case ConsultationAvailability.OFFLINE:
        user.markOffline();
        break;
      default:
        // for BUSY status, it should be set automatically by session management
        user.consultation_availability = availability;
        user.updated_at = new Date();
    }

    return this.save(user);
  }

  async markUserAvailable(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    user.markAvailable();
    return this.save(user);
  }

  async markUserUnavailable(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.markUnavailable();
    return this.save(user);
  }

  async markUserOffline(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.markOffline();
    return this.save(user);
  }
  // INHERITED from BaseUserRepository
  // - findById()
  // - findByEmail()
  // - findActiveAstrologers
  // = save()
}
