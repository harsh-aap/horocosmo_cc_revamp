import { Transform, Type } from "class-transformer";
import {IsEnum, IsObject, IsOptional, IsString, IsDate, IsUUID, MaxLength } from "class-validator";
import { MessageType } from "src/infrastructure/database/entities/message.entity";


export class SendMessageDto {
    @IsUUID()
    conversationId: string;

    @IsString()
    @MaxLength(5000) // prevent spam
    content: string;

    @IsEnum(MessageType)
    messageType: MessageType;
    
    @IsUUID()
    clientMessageId: string;

    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value)) // handle string dates
    timestamp: Date;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;

    //Business Validation
    validateContent(): boolean {
        if (this.messageType === MessageType.TEXT && this.content.trim().length === 0) {
            return false;
        }
        return true;
    }

    validateTimestamp(): boolean {
        if (this.timestamp < new Date(Date.now() - 1000 * 60 * 60 * 24)) {
            return false;
        }
        return true;
    }
}   