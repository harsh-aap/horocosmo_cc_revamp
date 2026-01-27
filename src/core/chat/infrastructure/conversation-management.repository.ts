import { Injectable } from '@nestjs/common';
import { ConversationBaseRepository } from './conversation-base.repository';
import { ConversationManagementPort } from '../application/interfaces/conversation-management.interface';
import { Conversation, ConversationStatus } from 'src/infrastructure/database/entities/conversation.entity';

@Injectable()
export class ConversationManagementRepository
  extends ConversationBaseRepository
  implements ConversationManagementPort
{
  async createConversation(userId: string, astrologerId: string): Promise<Conversation> {
    // Check if conversation already exists
    const existing = await this.findByUserAndAstrologer(userId, astrologerId);
    if (existing) {
      return existing;
    }

    return this.create(Conversation.create({ userId, astrologerId }));
  }

  async updateLastMessage(conversationId: string): Promise<Conversation> {
    const conversation = await this.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.updateLastMessage();
    return this.save(conversation);
  }

  async archiveConversation(conversationId: string): Promise<Conversation> {
    const conversation = await this.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.archive();
    return this.save(conversation);
  }

  async blockConversation(conversationId: string): Promise<Conversation> {
    const conversation = await this.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.block();
    return this.save(conversation);
  }

  async unblockConversation(conversationId: string): Promise<Conversation> {
    const conversation = await this.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.status = ConversationStatus.ACTIVE;
    conversation.updated_at = new Date();
    return this.save(conversation);
  }
}