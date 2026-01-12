import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO for updating user profile.
 * Validates the incoming request body for profile update endpoints.
 */
export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;
}
