import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { MonitoringModule } from './infrastructure/monitoring/monitoring.module';
import { UserModule } from './core/user/user.module';
import { WalletModule } from './core/wallet/wallet.module';
import { BillingModule } from './core/billing/billing.module';
import { ChatModule } from './core/chat/chat.module';
import { SessionModule } from './core/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    CacheModule,
    MonitoringModule,
    UserModule,
    WalletModule,
    BillingModule,
    ChatModule,
    SessionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
