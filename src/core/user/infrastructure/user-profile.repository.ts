import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseUserRepository } from "./base-user.repository";
import { UserProfilePort, UpdateProfileInput } from "../application/interfaces/user-profile.interface";
import { UserStatus, User } from "src/infrastructure/database/entities/user.entity";

@Injectable()
export class UserProfileRepository extends BaseUserRepository implements UserProfilePort{
    async updateProfile(userId: string, updates: UpdateProfileInput): Promise<User> {
        // getting user for the particular id here
        const user = await this.findById(userId);
        if (!user){
            throw new NotFoundException(`User with ID ${userId} not found`)
        }
        // updating profile can only update 
        user.updateProfile({
            name: updates.name,
            email: updates.email
        })
        return this.save(user);
    }

    async updateStatus(userId: string, status: UserStatus): Promise<User> {
        // getting user for the particular id here
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`)
        }

        user.status = status;
        user.updated_at = new Date();
        return this.save(user); // INHERITED METHOD
    }
    // INHERITED from BaseUserRepository
    // - findById()
    // - findByEmail()
    // - findActiveAstrologers
    // = save()
} 

