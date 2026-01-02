import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { DatabaseModule } from '../database/database.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
