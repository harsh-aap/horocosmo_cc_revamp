import { Injectable } from '@nestjs/common';
import { BaseUserRepository } from './base-user.repository';
import { UserQueryPort } from '../application/interfaces/user-query.interface';

@Injectable()
export class UserQueryRepository
  extends BaseUserRepository
  implements UserQueryPort {
  // No special method - only inherits common read operations from the base
  // - findById()
  // - findByIds()
  // - findByEmail()
  // - findActiveUsers()
  // - findActiveAstrologers()
  // - countUsers()
  // - countActiveAstrologers()
}
