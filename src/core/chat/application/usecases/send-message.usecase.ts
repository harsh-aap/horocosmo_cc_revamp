import { Inject, Injectable, Logger } from '@nestjs/common';
import { MESSAGE_MANAGEMENT_PORT, type MessageManagementPort } from '../interfaces/message-management.interface';
import { CONVERSATION_MANAGEMENT_PORT, type ConversationManagementPort } from '../interfaces/conversation-management.interface';
import { MessageType } from 'src/infrastructure/database/entities/message.entity';

@Injectable()
export class SendMessageUseCase {
    private readonly logger = new Logger(SendMessageUseCase.name);

    constructor(
        @Inject(MESSAGE_MANAGEMENT_PORT)
        private readonly messageRepo: MessageManagementPort,
        @Inject(CONVERSATION_MANAGEMENT_PORT)
        private readonly conversationRepo: ConversationManagementPort,
    ) { }

    async execute(props: {
        conversationId: string;
        senderId: string;
        messageType: MessageType;
        content: string;
        sessionId?: string;
        metadata?: Record<string, any>;
    }) {
        try {
            this.logger.log(`Sending message in conversation ${props.conversationId}`);

            const message = await this.messageRepo.sendMessage(props);

            // Update conversation's last message timestamp
            await this.conversationRepo.updateLastMessage(props.conversationId);

            return {
                id: message.id,
                conversationId: message.conversation_id,
                senderId: message.sender_id,
                messageType: message.message_type,
                content: message.content,
                sentAt: message.sent_at,
                sessionId: message.session_id,
            };
        } catch (error) {
            this.logger.error(`Error sending message: ${error.message}`, error.stack);
            throw error;
        }
    }
}