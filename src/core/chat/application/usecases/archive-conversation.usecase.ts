import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONVERSATION_MANAGEMENT_PORT, type ConversationManagementPort } from '../interfaces/conversation-management.interface';

@Injectable()
export class ArchiveConversationUseCase {
  private readonly logger = new Logger(ArchiveConversationUseCase.name);

  constructor(
    @Inject(CONVERSATION_MANAGEMENT_PORT)
    private readonly conversationRepo: ConversationManagementPort,
  ) {}

  async execute(conversationId: string) {
    try {
      this.logger.log(`Archiving conversation ${conversationId}`);

      const conversation = await this.conversationRepo.archiveConversation(conversationId);

      return {
        id: conversation.id,
        status: conversation.status,
        updatedAt: conversation.updated_at,
      };
    } catch (error) {
      this.logger.error(`Error archiving conversation: ${error.message}`, error.stack);
      throw error;
    }
  }
}