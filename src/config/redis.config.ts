import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (configService: ConfigService) => ({
  // Basic Connection
  host: configService.get('REDIS_HOST', 'localhost'),
  port: configService.get('REDIS_PORT', 6379),
  password: configService.get('REDIS_PASSWORD'),
  db: configService.get('REDIS_DB', 0),

  // key Management
  keyPrefix: configService.get('REDIS_KEY_PREFIX', 'horocosmo:v2:'),

  // reliabliity settings
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: false,

  // cluster settings
  cluster: configService.get('REDIS_CLUSTER_ENABLED', false)
    ? {
        enableReadyCheck: false,
        redisOptions: {
          password: configService.get('REDIS_PASSWORD'),
        },
      }
    : undefined,

  sentinel: configService.get('REDIS_SENTINEL_ENABLED', false)
    ? {
        sentinels: configService
          .get('REDIS_SENTINELS', [])
          .map((sentinel: string) => {
            const [host, port] = sentinel.split(':');
            return { host, port: parseInt(port, 10) };
          }),
        name: configService.get('REDIS_SENTINEL_NAME', 'mymaster'),
      }
    : undefined,
});