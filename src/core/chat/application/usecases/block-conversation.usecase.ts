import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONVERSATION_MANAGEMENT_PORT,  type ConversationManagementPort } from '../interfaces/conversation-management.interface';

@Injectable()
export class BlockConversationUseCase {
  private readonly logger = new Logger(BlockConversationUseCase.name);

  constructor(
    @Inject(CONVERSATION_MANAGEMENT_PORT)
    private readonly conversationRepo: ConversationManagementPort,
  ) {}

  async execute(conversationId: string) {
    try {
      this.logger.log(`Blocking conversation ${conversationId}`);

      const conversation = await this.conversationRepo.blockConversation(conversationId);

      return {
        id: conversation.id,
        status: conversation.status,
        updatedAt: conversation.updated_at,
      };
    } catch (error) {
      this.logger.error(`Error blocking conversation: ${error.message}`, error.stack);
      throw error;
    }
  }
}