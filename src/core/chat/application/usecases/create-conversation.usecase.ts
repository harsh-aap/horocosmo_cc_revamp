import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONVERSATION_MANAGEMENT_PORT, type ConversationManagementPort } from '../interfaces/conversation-management.interface';

@Injectable()
export class CreateConversationUseCase {
    private readonly logger = new Logger(CreateConversationUseCase.name);

    constructor(
        @Inject(CONVERSATION_MANAGEMENT_PORT)
        private readonly conversationRepo: ConversationManagementPort,
    ) { }

    async execute(userId: string, astrologerId: string) {
        try {
            this.logger.log(`Creating conversation between user ${userId} and astrologer ${astrologerId}`);

            const conversation = await this.conversationRepo.createConversation(userId, astrologerId);

            return {
                id: conversation.id,
                userId: conversation.user_id,
                astrologerId: conversation.astrologer_id,
                status: conversation.status,
                createdAt: conversation.created_at,
            };
        } catch (error) {
            this.logger.error(`Error creating conversation: ${error.message}`, error.stack);
            throw error;
        }
    }
}