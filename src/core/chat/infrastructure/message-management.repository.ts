import { Injectable } from '@nestjs/common';
import { MessageBaseRepository } from './message-base.repository';
import { Repository, Not, IsNull } from 'typeorm';
import { MessageManagementPort } from '../application/interfaces/message-management.interface';
import { Message, MessageType } from 'src/infrastructure/database/entities/message.entity';

@Injectable()
export class MessageManagementRepository
    extends MessageBaseRepository
    implements MessageManagementPort {
    async sendMessage(props: {
        conversationId: string;
        senderId: string;
        messageType: MessageType;
        content: string;
        sessionId?: string;
        metadata?: Record<string, any>;
    }): Promise<Message> {
        const message = await this.create(Message.create({
            conversationId: props.conversationId,
            senderId: props.senderId,
            messageType: props.messageType,
            content: props.content,
            sessionId: props.sessionId,
            metadata: props.metadata,
        }));

        // TODO: Update conversation's last_message_at via event or service
        // This could be done via ConversationManagementPort

        return message;
    }

    async markMessageDelivered(messageId: string): Promise<Message> {
        const message = await this.findById(messageId);
        if (!message) throw new Error('Message not found');

        message.markDelivered();
        return this.save(message);
    }

    async markMessageRead(messageId: string): Promise<Message> {
        const message = await this.findById(messageId);
        if (!message) throw new Error('Message not found');

        message.markRead();
        return this.save(message);
    }

    async markMessagesRead(conversationId: string, userId: string): Promise<void> {
        // Mark all unread messages in conversation as read (except user's own messages)
        await this.repo.update(
            {
                conversation_id: conversationId,
                sender_id: Not(userId),
                read_at: IsNull(),
            },
            { read_at: new Date(), updated_at: new Date() }
        );
    }

    async deleteMessage(messageId: string): Promise<void> {
        const message = await this.findById(messageId);
        if (!message) throw new Error('Message not found');

        await this.delete(messageId);
    }
}