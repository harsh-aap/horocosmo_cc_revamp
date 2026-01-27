import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSessionUseCase } from '../application/usecases/create-session.usecase';
import { StartSessionUseCase } from '../application/usecases/start-session.usecase';
import { EndSessionUseCase } from '../application/usecases/end-session.usecase';
import { GetSessionDetailsUseCase } from '../application/usecases/get-session-details.usecase';
import { GetUserSessionsUseCase } from '../application/usecases/get-user-sessions.usecase';
import { SessionType, SessionStatus } from 'src/infrastructure/database/entities/consultation-session.entity';

@ApiTags('Session')
@Controller('sessions')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly startSessionUseCase: StartSessionUseCase,
    private readonly endSessionUseCase: EndSessionUseCase,
    private readonly getSessionDetailsUseCase: GetSessionDetailsUseCase,
    private readonly getUserSessionsUseCase: GetUserSessionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new consultation session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async createSession(@Body() body: {
    astrologerId: string;
    userId: string;
    sessionType: string;
    conversationId?: string;
  }) {
    this.logger.log(`Creating session between ${body.userId} and ${body.astrologerId}`);
    return this.createSessionUseCase.execute({
      astrologerId: body.astrologerId,
      userId: body.userId,
      sessionType: body.sessionType as SessionType,
      conversationId: body.conversationId,
    });
  }

  @Put(':sessionId/start')
  @ApiOperation({ summary: 'Start a consultation session' })
  @ApiResponse({ status: 200, description: 'Session started successfully' })
  async startSession(@Param('sessionId') sessionId: string) {
    this.logger.log(`Starting session ${sessionId}`);
    return this.startSessionUseCase.execute(sessionId);
  }

  @Put(':sessionId/end')
  @ApiOperation({ summary: 'End a consultation session' })
  @ApiResponse({ status: 200, description: 'Session ended successfully' })
  async endSession(@Param('sessionId') sessionId: string) {
    this.logger.log(`Ending session ${sessionId}`);
    return this.endSessionUseCase.execute(sessionId);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get session details with participants' })
  @ApiResponse({ status: 200, description: 'Session details retrieved' })
  async getSessionDetails(@Param('sessionId') sessionId: string) {
    return this.getSessionDetailsUseCase.execute(sessionId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all sessions for a user' })
  @ApiResponse({ status: 200, description: 'User sessions retrieved' })
  async getUserSessions(
    @Param('userId') userId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    return this.getUserSessionsUseCase.execute(userId, status as SessionStatus, limit);
  }

  @Get('astrologer/:astrologerId')
  @ApiOperation({ summary: 'Get all sessions for an astrologer' })
  @ApiResponse({ status: 200, description: 'Astrologer sessions retrieved' })
  async getAstrologerSessions(
    @Param('astrologerId') astrologerId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    // TODO: Create GetAstrologerSessionsUseCase similar to GetUserSessionsUseCase
    return this.getUserSessionsUseCase.execute(astrologerId, status as SessionStatus, limit);
  }

  @Put(':sessionId/cancel')
  @ApiOperation({ summary: 'Cancel a consultation session' })
  @ApiResponse({ status: 200, description: 'Session cancelled successfully' })
  async cancelSession(@Param('sessionId') sessionId: string) {
    // TODO: Create CancelSessionUseCase
    this.logger.log(`Cancelling session ${sessionId}`);
    return { success: true, message: 'Session cancelled' };
  }

  @Put(':sessionId/rate')
  @ApiOperation({ summary: 'Rate a completed session' })
  @ApiResponse({ status: 200, description: 'Session rated successfully' })
  async rateSession(
    @Param('sessionId') sessionId: string,
    @Body() body: { astrologerRating?: number; userRating?: number },
  ) {
    // TODO: Create RateSessionUseCase
    this.logger.log(`Rating session ${sessionId}`);
    return { success: true, message: 'Session rated' };
  }

  @Post(':sessionId/participants')
  @ApiOperation({ summary: 'Add a participant to session' })
  @ApiResponse({ status: 201, description: 'Participant added successfully' })
  async addParticipant(
    @Param('sessionId') sessionId: string,
    @Body() body: { userId: string; participantRole: string },
  ) {
    // TODO: Create AddParticipantUseCase
    this.logger.log(`Adding participant to session ${sessionId}`);
    return { success: true, message: 'Participant added' };
  }

  @Delete('participants/:participantId')
  @ApiOperation({ summary: 'Remove a participant from session' })
  @ApiResponse({ status: 200, description: 'Participant removed successfully' })
  async removeParticipant(@Param('participantId') participantId: string) {
    // TODO: Create RemoveParticipantUseCase
    this.logger.log(`Removing participant ${participantId}`);
    return { success: true, message: 'Participant removed' };
  }

  @Put('participants/:participantId/connection')
  @ApiOperation({ summary: 'Update participant connection status' })
  @ApiResponse({ status: 200, description: 'Connection status updated' })
  async updateConnectionStatus(
    @Param('participantId') participantId: string,
    @Body() body: { status: string },
  ) {
    // TODO: Create UpdateConnectionStatusUseCase
    this.logger.log(`Updating connection status for participant ${participantId}`);
    return { success: true, message: 'Connection status updated' };
  }
}