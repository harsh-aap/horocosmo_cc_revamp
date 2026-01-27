import { Injectable } from '@nestjs/common';
import { MessageBaseRepository } from './message-base.repository';
import { MessageQueryPort } from '../application/interfaces/message-query.interface';

@Injectable()
export class MessageQueryRepository
  extends MessageBaseRepository
  implements MessageQueryPort
{
  // Inherits all methods from base repository
}