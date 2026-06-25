import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from './users.schema';
import { expenses } from './expenses.schema';
import { migrationsHistory } from './migrations-history.schema';

export { users, expenses, migrationsHistory };

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Expense = InferSelectModel<typeof expenses>;
export type NewExpense = InferInsertModel<typeof expenses>;
export type MigrationHistory = InferSelectModel<typeof migrationsHistory>;
export type NewMigrationHistory = InferInsertModel<typeof migrationsHistory>;
