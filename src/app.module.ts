import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { configModule } from './configs/app.config';
import { httpConfig } from './configs/http.config';
import { loggerConfig } from './configs/logger.config';
import { typeormRootConfig } from './configs/typeorm.config';
import { DatabaseModule } from './databases/database.module';
import { ExpensesModule } from './expenses/expenses.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ClsModule.forRoot(typeormRootConfig),
    ConfigModule.forRoot(configModule),
    HttpModule.register(httpConfig),
    LoggerModule.forRoot(loggerConfig),
    AuthModule,
    DatabaseModule,
    ExpensesModule,
    HealthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
