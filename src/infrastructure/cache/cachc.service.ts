import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly client: Redis,
  ) {}

  async onModuleInit() {
    this.logger.log('Redis cache service initialized');
    await this.validateConnection();
  }

  async onModuleDestroy() {
    this.logger.log('Closing Redis connections...');
    this.client.disconnect();
  }

  private async validateConnection(): Promise<void> {
    try {
      await this.client.ping();
      this.logger.log('Redis connection validated successfully');
    } catch (error) {
      this.logger.error('Redis connection validation failed', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value === null) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      this.logger.error(`Cache get failed for key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.setex(key, ttl, serializedValue);
    } catch (error) {
      this.logger.error(`Cache set failed for key: ${key}`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      this.logger.error(`Cache delete failed for key: ${key}`, error);
      return false;
    }
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: Record<string, any>;
  }> {
    try {
      const startTime = performance.now();
      await this.client.ping();
      const responseTime = performance.now() - startTime;

      const info = await this.client.info();
      const connectedClients = info.match(/connected_clients:(\d+)/)?.[1];

      return {
        status: 'healthy',
        details: {
          responseTime: Math.round(responseTime * 100) / 100,
          connectedClients: parseInt(connectedClients || '0'),
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