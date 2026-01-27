import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONVERSATION_QUERY_PORT, type ConversationQueryPort } from '../interfaces/conversation-query.interface';
import { MESSAGE_QUERY_PORT, type MessageQueryPort } from '../interfaces/message-query.interface';
@Injectable()
export class GetConversationHistoryUseCase {
    private readonly logger = new Logger(GetConversationHistoryUseCase.name);

    constructor(
        @Inject(CONVERSATION_QUERY_PORT)
        private readonly conversationRepo: ConversationQueryPort,
        @Inject(MESSAGE_QUERY_PORT)
        private readonly messageRepo: MessageQueryPort,
    ) { }

    async execute(conversationId: string, limit: number = 50, offset: number = 0) {
        try {
            this.logger.log(`Getting history for conversation ${conversationId}`);

            const conversation = await this.conversationRepo.findById(conversationId);
            if (!conversation) throw new Error('Conversation not found');

            const messages = await this.messageRepo.findByConversationId(conversationId, limit, offset);
            const totalCount = await this.messageRepo.getMessageCount(conversationId);

            return {
                conversation: {
                    id: conversation.id,
                    userId: conversation.user_id,
                    astrologerId: conversation.astrologer_id,
                    status: conversation.status,
                    lastMessageAt: conversation.last_message_at,
                },
                messages: messages.map(m => ({
                    id: m.id,
                    senderId: m.sender_id,
                    messageType: m.message_type,
                    content: m.content,
                    sentAt: m.sent_at,
                    deliveredAt: m.delivered_at,
                    readAt: m.read_at,
                    sessionId: m.session_id,
                })),
                pagination: {
                    totalCount,
                    limit,
                    offset,
                    hasMore: offset + messages.length < totalCount,
                },
            };
        } catch (error) {
            this.logger.error(`Error getting conversation history: ${error.message}`, error.stack);
            throw error;
        }
    }
}