import { Conversation } from 'src/infrastructure/database/entities/conversation.entity';

export const CONVERSATION_QUERY_PORT = Symbol('CONVERSATION_QUERY_PORT');

export interface ConversationQueryPort {
  findById(id: string): Promise<Conversation | null>;
  findByUserAndAstrologer(userId: string, astrologerId: string): Promise<Conversation | null>;
  findUserConversations(userId: string, limit?: number): Promise<Conversation[]>;
  findAstrologerConversations(astrologerId: string, limit?: number): Promise<Conversation[]>;
  findActiveConversations(limit?: number): Promise<Conversation[]>;
  getConversationCount(userId: string): Promise<number>;
}