import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationSession } from 'src/infrastructure/database/entities/consultation-session.entity';
import { SessionParticipant } from 'src/infrastructure/database/entities/session-participant.entity';

// Interfaces
import { SESSION_QUERY_PORT } from './application/interfaces/session-query.interface';
import { SESSION_MANAGEMENT_PORT } from './application/interfaces/session-management.interface';
import { PARTICIPANT_QUERY_PORT } from './application/interfaces/participant-query.interface';
import { PARTICIPANT_MANAGEMENT_PORT } from './application/interfaces/participant-management.interface';

// Repositories
import { SessionBaseRepository } from './infrastructure/session-base.repository';
import { SessionQueryRepository } from './infrastructure/session-query.repository';
import { SessionManagementRepository } from './infrastructure/session-management.repository';
import { ParticipantBaseRepository } from './infrastructure/participant-base.repository';
import { ParticipantQueryRepository } from './infrastructure/participant-query.repository';
import { ParticipantManagementRepository } from './infrastructure/participant-management.repository';

// Use Cases
import { CreateSessionUseCase } from './application/usecases/create-session.usecase';
import { StartSessionUseCase } from './application/usecases/start-session.usecase';
import { EndSessionUseCase } from './application/usecases/end-session.usecase';
import { GetSessionDetailsUseCase } from './application/usecases/get-session-details.usecase';
import { GetUserSessionsUseCase } from './application/usecases/get-user-sessions.usecase';

// Controller
import { SessionController } from './presentation/session.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultationSession, SessionParticipant]),
  ],
  controllers: [
    SessionController,
  ],
  providers: [
    // Repositories
    SessionBaseRepository,
    {
      provide: SESSION_QUERY_PORT,
      useClass: SessionQueryRepository,
    },
    {
      provide: SESSION_MANAGEMENT_PORT,
      useClass: SessionManagementRepository,
    },
    ParticipantBaseRepository,
    {
      provide: PARTICIPANT_QUERY_PORT,
      useClass: ParticipantQueryRepository,
    },
    {
      provide: PARTICIPANT_MANAGEMENT_PORT,
      useClass: ParticipantManagementRepository,
    },

    // Use Cases
    CreateSessionUseCase,
    StartSessionUseCase,
    EndSessionUseCase,
    GetSessionDetailsUseCase,
    GetUserSessionsUseCase,
  ],
  exports: [
    SESSION_QUERY_PORT,
    SESSION_MANAGEMENT_PORT,
    PARTICIPANT_QUERY_PORT,
    PARTICIPANT_MANAGEMENT_PORT,
    CreateSessionUseCase,
    StartSessionUseCase,
    EndSessionUseCase,
    GetSessionDetailsUseCase,
    GetUserSessionsUseCase,
  ],
})
export class SessionModule { }