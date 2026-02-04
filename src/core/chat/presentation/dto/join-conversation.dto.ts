import { IsUUID, IsEnum, IsOptional } from "class-validator";
import { UserType } from "src/infrastructure/database/entities/user.entity";

export class JoinConversationDto {
    @IsUUID()
    conversationId: string;

    @IsUUID()
    userId: string;

    @IsEnum(UserType)
    userType: UserType;

    @IsOptional()
    @IsUUID()
    sessionId?: string;  // for consultation context
}