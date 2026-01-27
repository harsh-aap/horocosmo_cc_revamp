import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/infrastructure/database/entities/conversation.entity';
import { Message } from 'src/infrastructure/database/entities/message.entity';

// Interfaces
import { CONVERSATION_QUERY_PORT } from './application/interfaces/conversation-query.interface';
import { CONVERSATION_MANAGEMENT_PORT } from './application/interfaces/conversation-management.interface';
import { MESSAGE_QUERY_PORT } from './application/interfaces/message-query.interface';
import { MESSAGE_MANAGEMENT_PORT } from './application/interfaces/message-management.interface';

// Repositories
import { ConversationBaseRepository } from './infrastructure/conversation-base.repository';
import { ConversationQueryRepository } from './infrastructure/conversation-query.repository';
import { ConversationManagementRepository } from './infrastructure/conversation-management.repository';
import { MessageBaseRepository } from './infrastructure/message-base.repository';
import { MessageQueryRepository } from './infrastructure/message-query.repository';
import { MessageManagementRepository } from './infrastructure/message-management.repository';

// Use Cases
import { CreateConversationUseCase } from './application/usecases/create-conversation.usecase';
import { SendMessageUseCase } from './application/usecases/send-message.usecase';
import { GetConversationHistoryUseCase } from './application/usecases/get-conversation-history.usecase';
import { ArchiveConversationUseCase } from './application/usecases/archive-conversation.usecase';
import { BlockConversationUseCase } from './application/usecases/block-conversation.usecase';

// Controller
import { ChatController } from './presentation/chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
  ],
  controllers: [
    ChatController,
  ],
  providers: [
    // Repositories
    ConversationBaseRepository,
    {
      provide: CONVERSATION_QUERY_PORT,
      useClass: ConversationQueryRepository,
    },
    {
      provide: CONVERSATION_MANAGEMENT_PORT,
      useClass: ConversationManagementRepository,
    },
    MessageBaseRepository,
    {
      provide: MESSAGE_QUERY_PORT,
      useClass: MessageQueryRepository,
    },
    {
      provide: MESSAGE_MANAGEMENT_PORT,
      useClass: MessageManagementRepository,
    },

    // Use Cases
    CreateConversationUseCase,
    SendMessageUseCase,
    GetConversationHistoryUseCase,
    ArchiveConversationUseCase,
    BlockConversationUseCase,
  ],
  exports: [
    CONVERSATION_QUERY_PORT,
    CONVERSATION_MANAGEMENT_PORT,
    MESSAGE_QUERY_PORT,
    MESSAGE_MANAGEMENT_PORT,
    CreateConversationUseCase,
    SendMessageUseCase,
    GetConversationHistoryUseCase,
    ArchiveConversationUseCase,
    BlockConversationUseCase,
  ],
})
export class ChatModule { }