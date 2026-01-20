import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserProfileRequestDto {
    @ApiPropertyOptional({ description: 'User biography' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ description: 'Avatar image URL' })
    @IsOptional()
    @IsString()
    avatar_url?: string;

    @ApiPropertyOptional({ description: 'User preferences' })
    @IsOptional()
    @IsObject()
    preferences?: Record<string, any>;
}