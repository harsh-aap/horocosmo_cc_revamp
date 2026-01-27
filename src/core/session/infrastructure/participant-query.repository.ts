import { Injectable } from '@nestjs/common';
import { ParticipantBaseRepository } from './participant-base.repository';
import { ParticipantQueryPort } from '../application/interfaces/participant-query.interface';

@Injectable()
export class ParticipantQueryRepository
  extends ParticipantBaseRepository
  implements ParticipantQueryPort
{
  // Inherits all methods from base repository
}