import { pgTable, serial, bigint, varchar, timestamp, integer, boolean, text } from 'drizzle-orm/pg-core';

export const migrationsHistory = pgTable('migrations_history', {
  id: serial('id').primaryKey(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  name: varchar('name').notNull(),
  executedAt: timestamp('executed_at').defaultNow().notNull(),
  executionTime: integer('execution_time'),
  success: boolean('success').default(true).notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
