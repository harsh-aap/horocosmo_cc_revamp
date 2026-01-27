import { Injectable } from '@nestjs/common';
import { ConversationBaseRepository } from './conversation-base.repository';
import { ConversationQueryPort } from '../application/interfaces/conversation-query.interface';

@Injectable()
export class ConversationQueryRepository
  extends ConversationBaseRepository
  implements ConversationQueryPort
{
  // Inherits all methods from base repository
}