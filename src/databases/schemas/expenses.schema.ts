import { pgTable, uuid, varchar, decimal, date, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const expenses = pgTable('expenses', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: date('date').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  notes: text('notes'),
  userId: uuid('user_id').notNull().references(() => users.uuid, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('IDX_EXPENSES_USER_ID').on(table.userId),
  userCategoryIdx: index('IDX_EXPENSES_USER_CATEGORY').on(table.userId, table.category),
  userDateIdx: index('IDX_EXPENSES_USER_DATE').on(table.userId, table.date),
  userCategoryDateIdx: index('IDX_EXPENSES_USER_CATEGORY_DATE').on(table.userId, table.category, table.date),
  dateIdx: index('IDX_EXPENSES_DATE').on(table.date),
  categoryIdx: index('IDX_EXPENSES_CATEGORY').on(table.category),
  createdAtIdx: index('IDX_EXPENSES_CREATED_AT').on(table.createdAt),
}));
