import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { configModule } from './configs/app.config';
import { httpConfig } from './configs/http.config';
import { loggerConfig } from './configs/logger.config';
import { drizzleRootConfig } from './configs/drizzle.config';
import { DatabaseModule } from './databases/database.module';
import { DronesModule } from './drones/drones.module';
import { ExpensesModule } from './expenses/expenses.module';
import { HealthModule } from './health/health.module';
import { TodosModule } from './todos/todos.module';


@Module({
  imports: [
    ClsModule.forRoot(drizzleRootConfig),
    ConfigModule.forRoot(configModule),
    HttpModule.register(httpConfig),
    LoggerModule.forRoot(loggerConfig),
    AuthModule,
    DatabaseModule,
    DronesModule,
    ExpensesModule,
    HealthModule,
    TodosModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
