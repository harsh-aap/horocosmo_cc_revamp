import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO for updating user profile.
 * Validates the incoming request body for profile update endpoints.
 */
export class UpdateUserCoreRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
