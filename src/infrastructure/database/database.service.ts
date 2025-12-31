import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    this.logger.log('Database connection initialized');
    await this.validateConnection();
  }

  async onModuleDestroy() {
    this.logger.log('Closing Database Connections');
    await this.dataSource.destroy();
  }

  private async validateConnection(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('Database connection validated successfully here');
    } catch (error) {
      this.logger.log('Database connection validation failed', error);
      throw error;
    }
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: Record<string, any>;
  }> {
    try {
      const startTime = performance.now();
      await this.dataSource.query('SELECT 1 as health_check');
      const responseTime = performance.now() - startTime;

      return {
        status: 'healthy',
        details: {
          responseTime: Math.round(responseTime * 100) / 100,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error.message },
      };
    }
  }
}
