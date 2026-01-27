import { Message, MessageType } from 'src/infrastructure/database/entities/message.entity';

export const MESSAGE_MANAGEMENT_PORT = Symbol('MESSAGE_MANAGEMENT_PORT');

export interface MessageManagementPort {
  sendMessage(props: {
    conversationId: string;
    senderId: string;
    messageType: MessageType;
    content: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }): Promise<Message>;

  markMessageDelivered(messageId: string): Promise<Message>;
  markMessageRead(messageId: string): Promise<Message>;
  markMessagesRead(conversationId: string, userId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
}