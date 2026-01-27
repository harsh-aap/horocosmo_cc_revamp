import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Message } from 'src/infrastructure/database/entities/message.entity';

@Injectable()
export class MessageBaseRepository {
    protected readonly logger = new Logger(MessageBaseRepository.name);

    constructor(
        @InjectRepository(Message)
        protected readonly repo: Repository<Message>,
    ) { }

    async findById(id: string): Promise<Message | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByConversationId(conversationId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
        return this.repo.find({
            where: { conversation_id: conversationId },
            order: { sent_at: 'DESC' },
            take: limit,
            skip: offset,
        });
    }

    async findBySenderId(senderId: string, limit: number = 50): Promise<Message[]> {
        return this.repo.find({
            where: { sender_id: senderId },
            order: { sent_at: 'DESC' },
            take: limit,
        });
    }

    async findBySessionId(sessionId: string): Promise<Message[]> {
        return this.repo.find({
            where: { session_id: sessionId },
            order: { sent_at: 'ASC' },
        });
    }

    async getMessageCount(conversationId: string): Promise<number> {
        return this.repo.count({ where: { conversation_id: conversationId } });
    }

    async getUnreadCount(conversationId: string, userId: string): Promise<number> {
        return this.repo.count({
            where: {
                conversation_id: conversationId,
                sender_id: Not(userId), // Messages not sent by this user
                read_at: IsNull(), // Not read yet
            },
        });
    }

    async save(message: Message): Promise<Message> {
        return this.repo.save(message);
    }

    async create(messageData: Partial<Message>): Promise<Message> {
        const message = this.repo.create(messageData);
        return this.repo.save(message);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}