export const CONSULTATION_WS_EVENTS = {
    JOIN_THREAD: 'consultation:thread:join',
    JOINED_THREAD: 'consultation:thread:joined',
    JOIN_THREAD_ERROR: 'consultation:thread:join_error',

    // Message within a consultation thread
    SEND_MESSAGE: 'consultation:message:send',
    SEND_MESSAGE_ACK: 'consultation:message:ack',
    SEND_MESSAGE_ERROR: 'consultation:message:error',
    MESSAGE_RECEIVED: 'consultation:message:received',
} as const

// WebSocket payloads

export type JoinThreadPayload = {
    conversationId: string; // conversationThreadId
};

export type SendMessagePayload = {
    conversationId: string;
    message: string;
    clientMessageId: string //client-generated UUID
    timestamp: Date // timestamp so that we know when the message was sent for the latency and all here
}

export type SendMessageAckPayload = {
    clientMessageId: string;
    serverReceivedAt: Date;
}
