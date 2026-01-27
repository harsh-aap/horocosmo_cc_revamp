import { Conversation } from 'src/infrastructure/database/entities/conversation.entity';

export const CONVERSATION_MANAGEMENT_PORT = Symbol('CONVERSATION_MANAGEMENT_PORT');

export interface ConversationManagementPort {
  createConversation(userId: string, astrologerId: string): Promise<Conversation>;
  updateLastMessage(conversationId: string): Promise<Conversation>;
  archiveConversation(conversationId: string): Promise<Conversation>;
  blockConversation(conversationId: string): Promise<Conversation>;
  unblockConversation(conversationId: string): Promise<Conversation>;
}