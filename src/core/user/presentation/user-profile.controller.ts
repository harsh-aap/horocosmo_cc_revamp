import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Query,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';


//DTOs
import { UpdateUserProfileRequestDto } from './dto/update-user-profile-request.dto';

// USECASEs
import { CreateUserProfileUseCase } from '../application/usecaes/user-profile-usecases/create-user-profile.usecase';
import { UpdateUserProfileUseCase } from '../application/usecaes/user-profile-usecases/update-user-profile.usecase';
import { GetUserProfileUseCase } from '../application/usecaes/user-profile-usecases/get-user-profile.usecase';
import { AddUserRatingUseCase } from '../application/usecaes/user-profile-usecases/add-user-rating.usecase';
import { UpdateUserProfileStatsUseCase } from '../application/usecaes/user-profile-usecases/update-user-profile-stats.usecase';
import { GetUserProfileStatsUseCase } from '../application/usecaes/user-profile-usecases/get-user-profile-stats.usecase';
import { GetTopRatedUserProfilesUseCase } from '../application/usecaes/user-profile-usecases/get-top-rated-user-profiles.usecase';

/**
 * UserProfileController
 *
 * Handles all HTTP requests related to user profile operations.
 */
@ApiTags('User Profiles')
@Controller('users')
export class UserProfileController {
    constructor(
        private readonly createUserProfileUseCase: CreateUserProfileUseCase,
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
        private readonly addUserRatingUseCase: AddUserRatingUseCase,
        private readonly updateUserProfileStatsUseCase: UpdateUserProfileStatsUseCase,
        private readonly getUserProfileStatsUseCase: GetUserProfileStatsUseCase,
        private readonly getTopRatedUserProfilesUseCase: GetTopRatedUserProfilesUseCase,
    ) { }

    /**
     * Get user profile
     */
    @Get(':id/profile')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Profile retrieved' })
    async getUserProfile(@Param('id') userId: string) {
        const profile = await this.getUserProfileUseCase.execute(userId);
        return {
            success: true,
            data: profile,
            message: 'User profile retrieved successfully',
        };
    }

    /**
     * Create user profile
     */
    @Post(':id/profile')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create user profile' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 201, description: 'Profile created' })
    async createUserProfile(
        @Param('id') userId: string,
        @Body() body: { bio?: string; avatar_url?: string },
    ) {
        const profile = await this.createUserProfileUseCase.execute({
            userId,
            bio: body.bio,
            avatar_url: body.avatar_url,
        });

        return {
            success: true,
            data: profile,
            message: 'User profile created successfully',
        };
    }

    /**
     * Update user profile
     */
    @Patch(':id/profile')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Profile updated' })
    async updateUserProfile(
        @Param('id') userId: string,
        @Body() body: UpdateUserProfileRequestDto,
    ) {
        const profile = await this.updateUserProfileUseCase.execute({
            userId,
            bio: body.bio,
            avatar_url: body.avatar_url,
            preferences: body.preferences,
        });

        return {
            success: true,
            data: profile,
            message: 'User profile updated successfully',
        };
    }

    /**
     * Get user profile statistics
     */
    @Get(':id/stats')
    @ApiOperation({ summary: 'Get user profile statistics' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved' })
    async getUserProfileStats(@Param('id') userId: string) {
        const stats = await this.getUserProfileStatsUseCase.execute(userId);
        return {
            success: true,
            data: stats,
            message: 'User profile statistics retrieved successfully',
        };
    }

    /**
     * Add rating to user
     */
    @Post(':id/rate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add rating to user profile' })
    @ApiParam({ name: 'id', description: 'User ID to rate' })
    @ApiResponse({ status: 200, description: 'Rating added' })
    async addUserRating(
        @Param('id') userId: string,
        @Body() body: { rating: number },
    ) {
        const profile = await this.addUserRatingUseCase.execute({
            userId,
            rating: body.rating,
        });

        return {
            success: true,
            data: {
                id: profile.id,
                user_id: profile.user_id,
                average_rating: profile.average_rating,
                total_ratings: profile.total_ratings,
            },
            message: 'Rating added successfully',
        };
    }

    /**
     * Update profile statistics (internal use)
     */
    @Post(':id/stats')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update user profile statistics' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Statistics updated' })
    async updateUserProfileStats(
        @Param('id') userId: string,
        @Body() body: { incrementConsultations?: boolean; incrementCompletedConsultations?: boolean },
    ) {
        const profile = await this.updateUserProfileStatsUseCase.execute({
            userId,
            incrementConsultations: body.incrementConsultations,
            incrementCompletedConsultations: body.incrementCompletedConsultations,
        });

        return {
            success: true,
            data: {
                id: profile.id,
                total_consultations: profile.total_consultations,
                completed_consultations: profile.completed_consultations,
            },
            message: 'Profile statistics updated successfully',
        };
    }

    /**
     * Get top rated profiles
     */
    @Get('profiles/top-rated')
    @ApiOperation({ summary: 'Get top rated user profiles' })
    @ApiResponse({ status: 200, description: 'Top rated profiles retrieved' })
    async getTopRatedProfiles(
        @Query() query: { minRating?: number; limit?: number }
    ) {
        const profiles = await this.getTopRatedUserProfilesUseCase.execute({
            minRating: query.minRating || 4.0,
            limit: query.limit || 10,
        });

        return {
            success: true,
            data: profiles,
            message: 'Top rated profiles retrieved successfully',
        };
    }
}