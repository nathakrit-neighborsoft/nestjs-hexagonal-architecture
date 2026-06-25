import { Module } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/databases/schemas';
import { DatabaseModule } from 'src/databases/database.module';
import { DRIZZLE_DB } from 'src/databases/drizzle.database.providers';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AUTH_TOKEN } from './auth.token';
import { createAuth } from './auth';

type DrizzleDB = NodePgDatabase<typeof schema>;

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_TOKEN,
      inject: [DRIZZLE_DB],
      useFactory: (db: DrizzleDB) => createAuth(db),
    },
    AuthGuard,
  ],
  exports: [AUTH_TOKEN, AuthGuard],
})
export class AuthModule {}
