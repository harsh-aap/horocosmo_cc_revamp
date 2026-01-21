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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { CreateAstrologerProfileUseCase } from '../application/usecaes/astrologer-profile-usecases/create-astrologer-profile.usecase';
import { UpdateAstrologerProfileUseCase } from '../application/usecaes/astrologer-profile-usecases/update-astrologer-profile.usecase';
import { GetAstrologerProfileUseCase } from '../application/usecaes/astrologer-profile-usecases/get-astrologer-profile.usecase';
import { UpdateAstrologerRatesUseCase } from '../application/usecaes/astrologer-profile-usecases/update-astrologer-rates.usecase';
import { GetAstrologerAvailabilityUseCase } from '../application/usecaes/astrologer-profile-usecases/get-astrologer-availability.usecase';
import { UpdateAstrologerStatsUseCase } from '../application/usecaes/astrologer-profile-usecases/update-astrologer-stats.usecase';
import { CalculateConsultationCostUseCase } from '../application/usecaes/astrologer-profile-usecases/calculate-consultation-cost.usecase';
import { GetTopRatedAstrologersUseCase } from '../application/usecaes/astrologer-profile-usecases/get-top-rated-astrologers.usecase';
import { GetAstrologerBySpecializationUseCase } from '../application/usecaes/astrologer-profile-usecases/get-astrologer-by-specialization.usecase';

/**
 * AstrologerProfileController
 *
 * Handles all HTTP requests related to astrologer business profile operations.
 */
@ApiTags('Astrologer Profiles')
@Controller('users')
export class AstrologerProfileController {
    constructor(
        private readonly createAstrologerProfileUseCase: CreateAstrologerProfileUseCase,
        private readonly updateAstrologerProfileUseCase: UpdateAstrologerProfileUseCase,
        private readonly getAstrologerProfileUseCase: GetAstrologerProfileUseCase,
        private readonly updateAstrologerRatesUseCase: UpdateAstrologerRatesUseCase,
        private readonly getAstrologerAvailabilityUseCase: GetAstrologerAvailabilityUseCase,
        private readonly updateAstrologerStatsUseCase: UpdateAstrologerStatsUseCase,
        private readonly calculateConsultationCostUseCase: CalculateConsultationCostUseCase,
        private readonly getTopRatedAstrologersUseCase: GetTopRatedAstrologersUseCase,
        private readonly getAstrologerBySpecializationUseCase: GetAstrologerBySpecializationUseCase,
    ) { }

    /**
     * Get astrologer business profile
     */
    @Get(':id/astrologer-profile')
    @ApiOperation({ summary: 'Get astrologer business profile' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 200, description: 'Business profile retrieved' })
    async getAstrologerProfile(@Param('id') astrologerId: string) {
        const profile = await this.getAstrologerProfileUseCase.execute(astrologerId);
        return {
            success: true,
            data: profile,
            message: 'Astrologer business profile retrieved successfully',
        };
    }

    /**
     * Create astrologer business profile
     */
    @Post(':id/astrologer-profile')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create astrologer business profile' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 201, description: 'Business profile created' })
    async createAstrologerProfile(
        @Param('id') astrologerId: string,
        @Body() body: {
            chatRatePerMinute: number;
            callRatePerMinute: number;
            maxConcurrentSessions?: number;
            specializations?: string[];
        },
    ) {
        const profile = await this.createAstrologerProfileUseCase.execute({
            astrologerId,
            chatRatePerMinute: body.chatRatePerMinute,
            callRatePerMinute: body.callRatePerMinute,
            maxConcurrentSessions: body.maxConcurrentSessions,
            specializations: body.specializations,
        });

        return {
            success: true,
            data: profile,
            message: 'Astrologer business profile created successfully',
        };
    }

    /**
     * Update astrologer business profile
     */
    @Patch(':id/astrologer-profile')
    @ApiOperation({ summary: 'Update astrologer business profile' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 200, description: 'Business profile updated' })
    async updateAstrologerProfile(
        @Param('id') astrologerId: string,
        @Body() body: {
            chat_rate_per_minute?: number;
            call_rate_per_minute?: number;
            max_concurrent_sessions?: number;
            specializations?: string[];
        },
    ) {
        const profile = await this.updateAstrologerProfileUseCase.execute(astrologerId, {
            chat_rate_per_minute: body.chat_rate_per_minute,
            call_rate_per_minute: body.call_rate_per_minute,
            max_concurrent_sessions: body.max_concurrent_sessions,
            specializations: body.specializations,
        });

        return {
            success: true,
            data: profile,
            message: 'Astrologer business profile updated successfully',
        };
    }

    /**
     * Update astrologer rates
     */
    @Patch(':id/astrologer-profile/rates')
    @ApiOperation({ summary: 'Update astrologer consultation rates' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 200, description: 'Rates updated' })
    async updateAstrologerRates(
        @Param('id') astrologerId: string,
        @Body() body: { chat_rate_per_minute?: number; call_rate_per_minute?: number },
    ) {
        const profile = await this.updateAstrologerRatesUseCase.execute(astrologerId, {
            chat_rate_per_minute: body.chat_rate_per_minute,
            call_rate_per_minute: body.call_rate_per_minute,
        });

        return {
            success: true,
            data: profile,
            message: 'Astrologer rates updated successfully',
        };
    }

    /**
     * Get astrologer availability
     */
    @Get(':id/astrologer-profile/availability')
    @ApiOperation({ summary: 'Get astrologer availability and capacity' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 200, description: 'Availability retrieved' })
    async getAstrologerAvailability(@Param('id') astrologerId: string) {
        const availability = await this.getAstrologerAvailabilityUseCase.execute();
        // Filter for specific astrologer if needed, or return general availability
        return {
            success: true,
            data: availability,
            message: 'Astrologer availability retrieved successfully',
        };
    }

    /**
     * Update astrologer statistics
     */
    @Post(':id/astrologer-profile/stats')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update astrologer monthly statistics' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 200, description: 'Statistics updated' })
    async updateAstrologerStats(
        @Param('id') astrologerId: string,
        @Body() body: { sessionsCount: number; rating: number },
    ) {
        const profile = await this.updateAstrologerStatsUseCase.execute({
            astrologerId,
            sessionsCount: body.sessionsCount,
            rating: body.rating,
        });

        return {
            success: true,
            data: profile,
            message: 'Astrologer statistics updated successfully',
        };
    }

    /**
     * Calculate consultation cost
     */
    @Post(':id/astrologer-profile/calculate-cost')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Calculate consultation cost' })
    @ApiParam({ name: 'id', description: 'Astrologer User ID' })
    @ApiResponse({ status: 200, description: 'Cost calculated' })
    async calculateConsultationCost(
        @Param('id') astrologerId: string,
        @Body() body: { sessionType: 'chat' | 'call'; minutes: number },
    ) {
        const cost = await this.calculateConsultationCostUseCase.execute({
            astrologerId,
            sessionType: body.sessionType,
            minutes: body.minutes,
        });

        return {
            success: true,
            data: { cost },
            message: 'Consultation cost calculated successfully',
        };
    }

    /**
     * Get top rated astrologers
     */
    @Get('astrologers/top-rated')
    @ApiOperation({ summary: 'Get top rated astrologers' })
    @ApiQuery({ name: 'minRating', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Top rated astrologers retrieved' })
    async getTopRatedAstrologers(
        @Query() query: { minRating?: number; limit?: number }
    ) {
        const astrologers = await this.getTopRatedAstrologersUseCase.execute({
            minRating: query.minRating,
            limit: query.limit,
        });

        return {
            success: true,
            data: astrologers,
            message: 'Top rated astrologers retrieved successfully',
        };
    }

    /**
     * Get astrologers by specialization
     */
    @Get('astrologers/by-specialization')
    @ApiOperation({ summary: 'Get astrologers by specialization' })
    @ApiQuery({ name: 'specialization', required: true, type: String })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Astrologers retrieved' })
    async getAstrologersBySpecialization(
        @Query() query: { specialization: string; limit?: number }
    ) {
        const astrologers = await this.getAstrologerBySpecializationUseCase.execute({
            specialization: query.specialization,
            limit: query.limit,
        });

        return {
            success: true,
            data: astrologers,
            message: 'Astrologers by specialization retrieved successfully',
        };
    }
}