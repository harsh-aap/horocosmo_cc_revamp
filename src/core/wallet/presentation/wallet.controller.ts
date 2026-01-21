import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
 
  import { CreateWalletUseCase } from '../application/usecases/create-wallet.usecase';
  import { GetWalletBalanceUseCase } from '../application/usecases/get-wallet-balance.usecase';
  import { HoldFundsUseCase } from '../application/usecases/hold-funds.usecase';
  import { ReleaseFundsUseCase } from '../application/usecases/release-funds.usecase';
  import { AddFundsUseCase } from '../application/usecases/add-funds.usecase';
  import { DeductFundsUseCase } from '../application/usecases/dedduct-funds.usecase';
  /**
   * WalletController
   */
  @ApiTags('Wallets')
  @Controller('users')
  export class WalletController {
    constructor(
      private readonly createWalletUseCase: CreateWalletUseCase,
      private readonly getWalletBalanceUseCase: GetWalletBalanceUseCase,
      private readonly holdFundsUseCase: HoldFundsUseCase,
      private readonly releaseFundsUseCase: ReleaseFundsUseCase,
      private readonly addFundsUseCase: AddFundsUseCase,
      private readonly deductFundsUseCase: DeductFundsUseCase,
    ) {}
  
    /**
     * Get wallet balance
     */
    @Get(':id/wallet/balance')
    @ApiOperation({ summary: 'Get wallet balance' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Balance retrieved' })
    async getWalletBalance(@Param('id') userId: string) {
      const balance = await this.getWalletBalanceUseCase.execute(userId);
      return {
        success: true,
        data: balance,
        message: 'Wallet balance retrieved successfully',
      };
    }
  
    /**
     * Create wallet
     */
    @Post(':id/wallet')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create wallet' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 201, description: 'Wallet created' })
    async createWallet(
      @Param('id') userId: string,
      @Body() body: { initialBalance?: number },
    ) {
      const wallet = await this.createWalletUseCase.execute({
        userId,
        initialBalance: body.initialBalance,
      });
  
      return {
        success: true,
        data: wallet,
        message: 'Wallet created successfully',
      };
    }
  
    /**
     * Hold funds
     */
    @Post(':id/wallet/hold')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Hold funds in wallet' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Funds held' })
    async holdFunds(
      @Param('id') userId: string,
      @Body() body: { amount: number; description?: string },
    ) {
      const wallet = await this.holdFundsUseCase.execute({
        userId,
        amount: body.amount,
        description: body.description,
      });
  
      return {
        success: true,
        data: wallet,
        message: 'Funds held successfully',
      };
    }
  
    /**
     * Release funds
     */
    @Post(':id/wallet/release')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Release held funds' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Funds released' })
    async releaseFunds(
      @Param('id') userId: string,
      @Body() body: { amount: number; description?: string },
    ) {
      const wallet = await this.releaseFundsUseCase.execute({
        userId,
        amount: body.amount,
        description: body.description,
      });
  
      return {
        success: true,
        data: wallet,
        message: 'Funds released successfully',
      };
    }
  
    /**
     * Add funds
     */
    @Post(':id/wallet/add')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add funds to wallet' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Funds added' })
    async addFunds(
      @Param('id') userId: string,
      @Body() body: { amount: number; description?: string },
    ) {
      const wallet = await this.addFundsUseCase.execute({
        userId,
        amount: body.amount,
        description: body.description,
      });
  
      return {
        success: true,
        data: wallet,
        message: 'Funds added successfully',
      };
    }
  
    /**
     * Deduct funds
     */
    @Post(':id/wallet/deduct')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Deduct funds from wallet' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Funds deducted' })
    async deductFunds(
      @Param('id') userId: string,
      @Body() body: { amount: number; description?: string },
    ) {
      const wallet = await this.deductFundsUseCase.execute({
        userId,
        amount: body.amount,
        description: body.description,
      });
  
      return {
        success: true,
        data: wallet,
        message: 'Funds deducted successfully',
      };
    }
  }