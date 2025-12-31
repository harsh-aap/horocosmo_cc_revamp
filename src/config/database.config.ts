import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'horocosmo_user'),
  password: configService.get('DATABASE_PASSWORD', 'horocosmo123'),
  database: configService.get('DATABASE_NAME', 'horocosmo_consultationv2'),
  entities: [__dirname + '/../infrastructure/database/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../infrastructure/database/migrations/**/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  poolSize: configService.get('DATABASE_POOL_SIZE', 10),
  extra: {
    max: configService.get('DATABASE_MAX_CONNECTIONS', 20),
    min: configService.get('DATABASE_MIN_CONNECTIONS', 2),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
  retryAttempts: 3,
  retryDelay: 1000,
  cache: {
    duration: 60000,
  },
  ssl: configService.get('NODE_ENV') === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});