import { Injectable } from '@nestjs/common';
import { SessionBaseRepository } from './session-base.repository';
import { SessionQueryPort } from '../application/interfaces/session-query.interface';

@Injectable()
export class SessionQueryRepository
  extends SessionBaseRepository
  implements SessionQueryPort
{
  // Inherits all methods from base repository
}