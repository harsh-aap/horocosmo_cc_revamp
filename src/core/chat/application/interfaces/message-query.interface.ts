import { Message } from 'src/infrastructure/database/entities/message.entity';

export const MESSAGE_QUERY_PORT = Symbol('MESSAGE_QUERY_PORT');

export interface MessageQueryPort {
  findById(id: string): Promise<Message | null>;
  findByConversationId(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
  findBySenderId(senderId: string, limit?: number): Promise<Message[]>;
  findBySessionId(sessionId: string): Promise<Message[]>;
  getMessageCount(conversationId: string): Promise<number>;
  getUnreadCount(conversationId: string, userId: string): Promise<number>;
}