import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { user, session, account, verification } from './auth.schema';
import { expenses } from './expenses.schema';
import { migrationsHistory } from './migrations-history.schema';
import { drones } from './drones.schema';
import { todos } from './todos.schema';

export { user, session, account, verification, expenses, migrationsHistory, drones, todos };

export type Expense = InferSelectModel<typeof expenses>;
export type NewExpense = InferInsertModel<typeof expenses>;
export type MigrationHistory = InferSelectModel<typeof migrationsHistory>;
export type NewMigrationHistory = InferInsertModel<typeof migrationsHistory>;
export type Drone = InferSelectModel<typeof drones>;
export type NewDrone = InferInsertModel<typeof drones>;
export type Todo = InferSelectModel<typeof todos>;
export type NewTodo = InferInsertModel<typeof todos>;
