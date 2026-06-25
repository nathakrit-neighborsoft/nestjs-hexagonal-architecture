import { Module } from '@nestjs/common';
import { drizzleDatabaseProviders } from './drizzle.database.providers';

@Module({
  providers: [...drizzleDatabaseProviders],
  exports: [...drizzleDatabaseProviders],
})
export class DatabaseModule {}
