import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cachc.service';
import { getRedisConfig } from '../../config/redis.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    CacheService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisConfig = getRedisConfig(configService);

        const Redis = require('ioredis');
        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          db: redisConfig.db,
          keyPrefix: redisConfig.keyPrefix,
          retryDelayOnFailover: redisConfig.retryDelayOnFailover,
          maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
          lazyConnect: redisConfig.lazyConnect,
          cluster: redisConfig.cluster,
          sentinel: redisConfig.sentinel,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
