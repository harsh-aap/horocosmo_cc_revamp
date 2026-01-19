import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'horocosmo_user'),
  password: configService.get('DATABASE_PASSWORD', 'horocosmo123'),
  database: configService.get('DATABASE_NAME', 'horocosmo_consultationv2'),
  entities: [
    'src/infrastructure/database/entities/**/*.entity{.ts,.js}',
  ],
  migrations: [
    'src/infrastructure/database/migrations/**/*{.ts,.js}',
  ],
  synchronize: false, // NEVER true in production
  logging: false,
  ssl: configService.get('NODE_ENV') === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});