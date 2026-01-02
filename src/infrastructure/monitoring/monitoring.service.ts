import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '../cache/cachc.service';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ): void {
    // log slow request
    if (duration > 1000) {
      this.logger.warn(`Slow request: ${method} ${route} - ${duration}ms`);
    }

    // Could extend this send metrics to monitoring systems
    // we can use Prometheus, DataDog and all here
  }

  async getHealthStatus(){
    try{
        const dbHealth = await this.databaseService.getHealthStatus();
        const cacheHealth = await this.cacheService.getHealthStatus();

        const allHealthy = dbHealth.status === 'healthy' && cacheHealth.status === 'healthy';

        return {
            status: allHealthy ? 'healthy': 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: dbHealth,
                cache: cacheHealth,
            },
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            timestamp: new Date().toDateString(),
            error: error.message,
        }
    }
  }
}