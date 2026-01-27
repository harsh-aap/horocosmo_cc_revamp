import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateConversationUseCase } from '../application/usecases/create-conversation.usecase';
import { SendMessageUseCase } from '../application/usecases/send-message.usecase';
import { GetConversationHistoryUseCase } from '../application/usecases/get-conversation-history.usecase';
import { ArchiveConversationUseCase } from '../application/usecases/archive-conversation.usecase';
import { BlockConversationUseCase } from '../application/usecases/block-conversation.usecase';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(
        private readonly createConversationUseCase: CreateConversationUseCase,
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly getConversationHistoryUseCase: GetConversationHistoryUseCase,
        private readonly archiveConversationUseCase: ArchiveConversationUseCase,
        private readonly blockConversationUseCase: BlockConversationUseCase,
    ) { }

    @Post('conversations')
    @ApiOperation({ summary: 'Create a new conversation between user and astrologer' })
    @ApiResponse({ status: 201, description: 'Conversation created successfully' })
    async createConversation(@Body() body: { userId: string; astrologerId: string }) {
        this.logger.log(`Creating conversation between ${body.userId} and ${body.astrologerId}`);
        return this.createConversationUseCase.execute(body.userId, body.astrologerId);
    }

    @Get('conversations/:conversationId')
    @ApiOperation({ summary: 'Get conversation details with message history' })
    @ApiResponse({ status: 200, description: 'Conversation history retrieved' })
    async getConversationHistory(
        @Param('conversationId') conversationId: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
    ) {
        return this.getConversationHistoryUseCase.execute(conversationId, limit, offset);
    }

    @Put('conversations/:conversationId/archive')
    @ApiOperation({ summary: 'Archive a conversation' })
    @ApiResponse({ status: 200, description: 'Conversation archived' })
    async archiveConversation(@Param('conversationId') conversationId: string) {
        this.logger.log(`Archiving conversation ${conversationId}`);
        return this.archiveConversationUseCase.execute(conversationId);
    }

    @Put('conversations/:conversationId/block')
    @ApiOperation({ summary: 'Block a conversation' })
    @ApiResponse({ status: 200, description: 'Conversation blocked' })
    async blockConversation(@Param('conversationId') conversationId: string) {
        this.logger.log(`Blocking conversation ${conversationId}`);
        return this.blockConversationUseCase.execute(conversationId);
    }

    @Post('conversations/:conversationId/messages')
    @ApiOperation({ summary: 'Send a message in a conversation' })
    @ApiResponse({ status: 201, description: 'Message sent successfully' })
    async sendMessage(
        @Param('conversationId') conversationId: string,
        @Body() body: {
            senderId: string;
            messageType: string;
            content: string;
            sessionId?: string;
            metadata?: Record<string, any>;
        },
    ) {
        this.logger.log(`Sending message in conversation ${conversationId}`);
        return this.sendMessageUseCase.execute({
            conversationId,
            senderId: body.senderId,
            messageType: body.messageType as any,
            content: body.content,
            sessionId: body.sessionId,
            metadata: body.metadata,
        });
    }
}