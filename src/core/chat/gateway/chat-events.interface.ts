import { UserType } from "src/infrastructure/database/entities/user.entity";
import { MessageType } from "src/infrastructure/database/entities/message.entity";

// Enhanced event interfaces for WebSocket communication
export interface EventMetadata {
  correlationId: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
  sequenceNumber: number;
}

//Strongly typed event wrapper
export interface ChatEvent<T = any> {
  id: string;
  type: ChatEventType;
  payload: T;
  metadata: EventMetadata;
  version: '1.0';
}

// Namespaced event constants (industry standard)
export const CHAT_EVENTS = {
  // Client → Server
  CLIENT: {
    JOIN_CONVERSATION: 'chat:client:join_conversation',
    SEND_MESSAGE: 'chat:client:send_message',
    LEAVE_CONVERSATION: 'chat:client:leave_conversation',
    TYPING_START: 'chat:client:typing_start',
    TYPING_STOP: 'chat:client:typing_stop',
    MARK_READ: 'chat:client:mark_read',
  } as const,
  
  // Server → Client  
  SERVER: {
    CONVERSATION_JOINED: 'chat:server:conversation_joined',
    MESSAGE_RECEIVED: 'chat:server:message_received',
    MESSAGE_DELIVERED: 'chat:server:message_delivered',
    MESSAGE_READ: 'chat:server:message_read',
    USER_JOINED: 'chat:server:user_joined',
    USER_LEFT: 'chat:server:user_left',
    TYPING_INDICATOR: 'chat:server:typing_indicator',
    PRESENCE_UPDATE: 'chat:server:presence_update',
  } as const,
  
  // Error events
  ERROR: {
    INVALID_PAYLOAD: 'chat:error:invalid_payload',
    UNAUTHORIZED: 'chat:error:unauthorized', 
    CONVERSATION_NOT_FOUND: 'chat:error:conversation_not_found',
    RATE_LIMITED: 'chat:error:rate_limited',
    PERMISSION_DENIED: 'chat:error:permission_denied',
  } as const,
} as const;

// Union type for type safety
export type ChatEventType = typeof CHAT_EVENTS[keyof typeof CHAT_EVENTS][keyof typeof CHAT_EVENTS[keyof typeof CHAT_EVENTS]];

// Response interfaces
export interface MessageReceivedData {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderType: UserType;
  content: string;
  messageType: MessageType;
  timestamp: Date;
  clientMessageId: string;
  metadata?: Record<string, any>;
  sequenceNumber: number; // for ordering
}

export interface MessageDeliveredData {
  messageId: string;
  conversationId: string;
  deliveredAt: Date;
  deliveredTo: string[]; // Array of user IDs
  sequenceNumber: number;
}

export interface ConverationJoinedData {
  conversationId: string;
  userId: string;
  userType: UserType,
  joinedAt: Date;
  activeUsers: Array<{
    userId: string;
    userType: UserType;
    joinedAt: Date;
  }>;
}

export interface ChatError {
  code: string;
  message: string;
  details?: any;
  correlationId: string;
  timestamp: Date;
}