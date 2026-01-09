import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';

export enum UserType {
  USER = 'user',
  ASTROLOGER = 'astrologer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
}

@Entity('users')
@Check(`"type" IN ('user', 'astrologer')`)
@Check(`"status" IN ('active', 'inactive', 'suspended')`)
@Check(`"sync_status" IN ('synced', 'pending', 'failed')`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic User Info
  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  // User Type
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  @Index()
  type: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @Index()
  status: UserStatus;

  // Profile Info
  @Column({ type: 'text', nullable: true })
  avatar_url?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  // Astrologer-specific fields
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Column({ type: 'int', default: 0 })
  total_consultations: number;

  @Column({ type: 'int', default: 0 })
  completed_consultations: number;

  // Sync fields
  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  sync_status: SyncStatus;

  @Column({ type: 'timestamp', nullable: true })
  last_sync_at?: Date;

  @Column({ type: 'jsonb', nullable: true })
  sync_metadata?: Record<string, any>;

  // External ID from main backend
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  external_id: string;

  // Timestamps
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Business Methods (Domain Logic)
  updateProfile(updates: { name?: string; email?: string }): void {
    if (updates.name) this.name = updates.name;
    if (updates.email !== undefined) this.email = updates.email;
    this.updated_at = new Date();
  }

  markAsSynced(): void {
    this.sync_status = SyncStatus.SYNCED;
    this.last_sync_at = new Date();
    this.updated_at = new Date();
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isAstrologer(): boolean {
    return this.type === UserType.ASTROLOGER;
  }

  // Factory method
  static create(props: {
    name: string;
    email?: string;  // can be optional here
    externalId: string;
    type: UserType;
    phone: string;
  }): Partial<User> {
    return {
      name: props.name,
      email: props.email,
      external_id: props.externalId,
      type: props.type,
      status: UserStatus.ACTIVE,
      sync_status: SyncStatus.PENDING,
      phone: props.phone,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}
