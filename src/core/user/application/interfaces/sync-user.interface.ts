import { User } from 'src/infrastructure/database/entities/user.entity';
import { UserType } from 'src/infrastructure/database/entities/user.entity';

export const SYNC_USER_PORT = Symbol('SYNC_USER_PORT')
export interface SyncUserInput {
  externalId: string;
  name: string;
  email?: string | null;
  type: UserType;
  phone: string;
}

export interface SyncUserPort {
  findByExternalId(externalId: string): Promise<User | null>;
  save(user: User): Promise<User>;
  create(userData: Partial<User>): Promise<User>;
}