import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserType } from 'src/infrastructure/database/entities/user.entity';
import { Logger } from '@nestjs/common';

/**
 * DTO for syncing a user.
 * Validates the incoming request body for the /users/sync endpoint.
 * Logs creation for debugging purposes.
 */
export class SyncUserRequestDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(UserType)
  type: UserType;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
