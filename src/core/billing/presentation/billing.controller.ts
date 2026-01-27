import { Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBillingTransactionUseCase } from '../application/usecases/create-billing-transaction.usecase';
import { GetBillingHistoryUseCase } from '../application/usecases/get-billing-history.usecase';
import { GetPendingTransactionsUseCase } from '../application/usecases/get-pending-transactions.usecase';
import { MarkBillingTransactionCompletedUseCase } from '../application/usecases/mark-billing-transcation-completed.usecase';
import { MarkBillingTransactionFailedUseCase } from '../application/usecases/mark-billing-transcation-failed.usecase';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(
    private readonly createBillingTransactionUseCase: CreateBillingTransactionUseCase,
    private readonly getBillingHistoryUseCase: GetBillingHistoryUseCase,
    private readonly getPendingTransactionsUseCase: GetPendingTransactionsUseCase,
    private readonly markCompletedUseCase: MarkBillingTransactionCompletedUseCase,
    private readonly markFailedUseCase: MarkBillingTransactionFailedUseCase,
  ) {}

  @Post('transactions')
  @ApiOperation({ summary: 'Create a billing transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async createTransaction(@Body() body: {
    userId: string;
    transactionType: string;
    amount: number;
    sessionId?: string;
    description?: string;
    externalTransactionId?: string;
  }) {
    this.logger.log(`Creating billing transaction for user ${body.userId}`);
    return this.createBillingTransactionUseCase.execute({
      userId: body.userId,
      transactionType: body.transactionType as any,
      amount: body.amount,
      sessionId: body.sessionId,
      description: body.description,
      externalTransactionId: body.externalTransactionId,
    });
  }

  @Post('transactions/:id/complete')
  @ApiOperation({ summary: 'Mark billing transaction as completed' })
  @ApiResponse({ status: 200, description: 'Transaction marked as completed' })
  async markCompleted(@Param('id') id: string) {
    this.logger.log(`Marking transaction ${id} as completed`);
    return this.markCompletedUseCase.execute(id);
  }

  @Post('transactions/:id/fail')
  @ApiOperation({ summary: 'Mark billing transaction as failed' })
  @ApiResponse({ status: 200, description: 'Transaction marked as failed' })
  async markFailed(@Param('id') id: string) {
    this.logger.log(`Marking transaction ${id} as failed`);
    return this.markFailedUseCase.execute(id);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Get billing history for a user' })
  @ApiResponse({ status: 200, description: 'Billing history retrieved' })
  async getBillingHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.getBillingHistoryUseCase.execute(userId, limit);
  }

  @Get('pending/:userId')
  @ApiOperation({ summary: 'Get pending transactions for a user' })
  @ApiResponse({ status: 200, description: 'Pending transactions retrieved' })
  async getPendingTransactions(@Param('userId') userId: string) {
    return this.getPendingTransactionsUseCase.execute(userId);
  }
}