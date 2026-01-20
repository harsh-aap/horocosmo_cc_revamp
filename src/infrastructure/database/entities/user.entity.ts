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

export enum SessionStatus {
  IDLE = 'idle',
  IN_SESSION = 'in_session',
}

export enum ConsultationAvailability {
  AVAILABLE = 'available', // Ready for consultations
  UNAVAILABLE = 'unavailable', // User unavailable (AFK, break)
  BUSY = 'busy', // In session (auto-set)
  OFFLINE = 'offline', // Logged out
}

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
}

@Entity('users')
@Check(`"type" IN ('user', 'astrologer')`)
@Check(`"session_status" IN ('idle', 'in_session')`)
@Check(
  `"consultation_availability" IN ('available', 'unavailable', 'busy', 'offline')`,
)
@Check(`"status" IN ('active', 'inactive', 'suspended')`)
@Check(`"sync_status" IN ('synced', 'pending', 'failed')`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // CORE IDENTITY (Stable)
  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  phone: string;

  // Classification
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

  // Frequently READ STATUS
  @Column({
    type: 'enum',
    enum: ConsultationAvailability,
    default: ConsultationAvailability.OFFLINE,
  })
  @Index() // Critical for availability queries
  consultation_availability: ConsultationAvailability;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.IDLE,
  })
  @Index()
  session_status: SessionStatus;

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
  updateProfile(updates: {
    name?: string;
    email?: string;
  }): void {
    if (updates.name) this.name = updates.name;
    if (updates.email !== undefined) this.email = updates.email;
    this.updated_at = new Date();
  }

  markAsSynced(): void {
    this.sync_status = SyncStatus.SYNCED;
    this.last_sync_at = new Date();
    this.updated_at = new Date();
  }

  //availability methods (low-latency)
  isAvailableForConsultation(): boolean {
    return (
      this.consultation_availability === ConsultationAvailability.AVAILABLE
    );
  }

  markAvailable(): void {
    this.consultation_availability = ConsultationAvailability.AVAILABLE;
    this.updated_at = new Date();
  }

  markUnavailable(): void {
    this.consultation_availability = ConsultationAvailability.UNAVAILABLE;
    this.updated_at = new Date();
  }

  markOffline(): void {
    this.consultation_availability = ConsultationAvailability.OFFLINE;
    this.updated_at = new Date();
  }

  // session methods
  isInSession(): boolean {
    return this.session_status === SessionStatus.IN_SESSION;
  }

  markInSession(): void {
    this.session_status = SessionStatus.IN_SESSION;
    this.consultation_availability = ConsultationAvailability.BUSY; // Auto-set busy
    this.updated_at = new Date();
  }

  markIdle(): void {
    this.session_status = SessionStatus.IDLE;
    // Don't auto-change availability - user controls that here
    // uncomment the line if you want otherwise here
    // this.consultation_availability = ConsultationAvailability.AVAILABLE
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
    email?: string; // can be optional here
    externalId: string;
    type: UserType;
    phone: string;
  }): Partial<User> {
    return {
      name: props.name,
      email: props.email,
      phone: props.phone,
      external_id: props.externalId,
      type: props.type,
      status: UserStatus.ACTIVE,
      session_status: SessionStatus.IDLE,
      consultation_availability: ConsultationAvailability.OFFLINE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}
