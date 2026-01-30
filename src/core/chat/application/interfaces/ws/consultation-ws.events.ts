export const CONSULTATION_WS_EVENTS = {
    join_thread: 'consultation:thread:join',
    joined_thread: 'consultation:thread:joined',
    join_thread_error: 'consultation:thread:join_error',


    // Message within a consultation thread
    send_message: 'consultation:message:send',
    send_message_ack: 'consultation:message:ack',
    send_message_error: 'consultation:message:error',
    message_received: 'consultation:message:received',
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
