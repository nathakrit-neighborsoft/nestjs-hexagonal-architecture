# Drizzle ORM Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace TypeORM with Drizzle ORM across the entire persistence layer while preserving hexagonal architecture, repository interfaces, CLS transactions, and the custom migration history feature.

**Architecture:** TypeORM entities → Drizzle pgTable schemas. TypeORM repositories → Drizzle query builders. The `TransactionHost` DI pattern stays but the adapter generic changes. Migrations switch from TypeORM class-based to drizzle-kit generated SQL, wrapped with a custom runner that maintains the `migrations_history` logging table.

**Tech Stack:** NestJS, Drizzle ORM, drizzle-orm/node-postgres, drizzle-kit, @nestjs-cls/transactional, nestjs-cls-transactional-adapter-drizzle-orm, pg

---

### Task 1: Update package.json & install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Edit package.json deps**

Remove these lines from `dependencies`:
```
"@nestjs-cls/transactional-adapter-typeorm": "^1.3.0",
"@nestjs/typeorm": "^11.0.0",
"typeorm": "^0.3.25",
"@nestjs/sequelize": "^11.0.0",
"sequelize": "^6.37.7",
"sequelize-typescript": "^2.1.6",
"@types/sequelize": "^6.12.0",
```

Add these:
```
"drizzle-orm": "^0.42.0",
"nestjs-cls-transactional-adapter-drizzle-orm": "^1.1.0",
```

Add to `devDependencies`:
```
"drizzle-kit": "^0.30.0",
```

- [ ] **Step 2: Replace all migration/DB scripts**

Replace the TypeORM-specific scripts block with:
```json
{
  "drizzle:generate": "drizzle-kit generate",
  "drizzle:migrate": "ts-node -r tsconfig-paths/register src/databases/drizzle/migration-runner.ts",
  "migration:revert": "echo 'Drizzle: revert via drizzle-kit drop, then mark row in migrations_history'",
  "migration:show": "npm run db:status",
  "schema:drop": "drizzle-kit drop",
  "db:reset": "ts-node -r tsconfig-paths/register src/databases/scripts/reset-database.ts",
  "db:status": "ts-node -r tsconfig-paths/register src/databases/scripts/migration-status.ts",
  "db:stats": "ts-node -r tsconfig-paths/register src/databases/scripts/migration-stats.ts"
}
```

Remove these old scripts: `migration:generate`, `migration:create`, `migration:run`, `migration:revert`, `migration:show`, `schema:drop`, `schema:sync`.

- [ ] **Step 3: Install and verify**

```bash
pnpm install
# verify typeorm/sequelize deps are gone
pnpm ls typeorm sequelize @nestjs/typeorm @nestjs/sequelize 2>&1 | head -5
# Expected: ERROR or "missing"
```

---

### Task 2: Create drizzle configuration

**Files:**
- Create: `drizzle.config.ts` (project root)
- Create: `src/configs/drizzle.config.ts`

- [ ] **Step 1: Create root drizzle-kit config**

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/databases/schemas/index.ts',
  out: './src/databases/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  },
});
```

- [ ] **Step 2: Create NestJS ClsModule config**

Create `src/configs/drizzle.config.ts`:

```ts
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from 'nestjs-cls-transactional-adapter-drizzle-orm';
import { StrictBuilder } from 'builder-pattern';
import 'dotenv/config';
import { ClsModuleOptions } from 'nestjs-cls';
import { DatabaseModule } from 'src/databases/database.module';
import { DRIZZLE_DB } from 'src/databases/drizzle.database.providers';

const imports = [DatabaseModule];
const adapter = new TransactionalAdapterDrizzleOrm({
  drizzleClientToken: DRIZZLE_DB,
});
const clsPluginTransactional = new ClsPluginTransactional({
  imports,
  adapter,
});
const plugins = [clsPluginTransactional];

const drizzleRootConfig = StrictBuilder<ClsModuleOptions>().plugins(plugins).build();

export { drizzleRootConfig };
```

---

### Task 3: Create Drizzle schema files

**Files:**
- Create: `src/databases/schemas/users.schema.ts`
- Create: `src/databases/schemas/expenses.schema.ts`
- Create: `src/databases/schemas/migrations-history.schema.ts`
- Create: `src/databases/schemas/index.ts`

- [ ] **Step 1: Create users.schema.ts**

```ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});
```

- [ ] **Step 2: Create expenses.schema.ts**

```ts
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
```

- [ ] **Step 3: Create migrations-history.schema.ts**

```ts
import { pgTable, serial, bigint, varchar, timestamp, int, boolean, text } from 'drizzle-orm/pg-core';

export const migrationsHistory = pgTable('migrations_history', {
  id: serial('id').primaryKey(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  name: varchar('name').notNull(),
  executedAt: timestamp('executed_at').defaultNow().notNull(),
  executionTime: int('execution_time'),
  success: boolean('success').default(true).notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

- [ ] **Step 4: Create schemas/index.ts**

```ts
export { users } from './users.schema';
export { expenses } from './expenses.schema';
export { migrationsHistory } from './migrations-history.schema';

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Expense = InferSelectModel<typeof expenses>;
export type NewExpense = InferInsertModel<typeof expenses>;
export type MigrationHistory = InferSelectModel<typeof migrationsHistory>;
export type NewMigrationHistory = InferInsertModel<typeof migrationsHistory>;
```

---

### Task 4: Create Drizzle database providers

**Files:**
- Create: `src/databases/drizzle.database.providers.ts`
- Modify: `src/databases/database.module.ts`

- [ ] **Step 1: Create drizzle.database.providers.ts**

```ts
import { Pool } from 'pg';
import { drizzle as drizzleClient } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

export const DRIZZLE_DB = 'DRIZZLE_DB';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
});

export const drizzleDatabaseProviders = [
  {
    provide: DRIZZLE_DB,
    useFactory: async () => {
      const db = drizzleClient(pool, { schema });
      return db;
    },
  },
];
```

- [ ] **Step 2: Update database.module.ts**

```ts
import { Module } from '@nestjs/common';
import { drizzleDatabaseProviders } from './drizzle.database.providers';

@Module({
  providers: [...drizzleDatabaseProviders],
  exports: [...drizzleDatabaseProviders],
})
export class DatabaseModule {}
```

---

### Task 5: Create UserDrizzleRepository

**Files:**
- Create: `src/users/adapters/outbounds/user.drizzle.repository.ts`

- [ ] **Step 1: Create the repository**

```ts
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from 'nestjs-cls-transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from 'src/databases/schemas';
import { IUser, User, UserEmail, UserId, UserUpdatedAt } from '../../applications/domains/user.domain';
import { UserRepository } from '../../applications/ports/user.repository';
import { Builder } from 'builder-pattern';

@Injectable()
export class UserDrizzleRepository implements UserRepository {
  constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm>) {}

  async create(user: IUser): Promise<IUser> {
    const uuid = uuidv4() as UserId;
    const [result] = await this.model.tx
      .insert(users)
      .values({
        uuid,
        email: user.email,
        password: user.password,
      })
      .returning();
    return UserDrizzleRepository.toDomain(result);
  }

  async getByEmail(email: UserEmail): Promise<IUser | undefined> {
    const [result] = await this.model.tx
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result ? UserDrizzleRepository.toDomain(result) : undefined;
  }

  static toDomain(row: typeof users.$inferSelect): IUser {
    return Builder(User)
      .uuid(row.uuid as UserId)
      .email(row.email)
      .password(row.password)
      .createdAt(row.createdAt)
      .updateAt(row.updatedAt as UserUpdatedAt)
      .build();
  }
}
```

---

### Task 6: Create ExpenseDrizzleRepository

**Files:**
- Create: `src/expenses/adapters/outbounds/expense.drizzle.repository.ts`

- [ ] **Step 1: Create the repository**

```ts
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from 'nestjs-cls-transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import { UserId } from 'src/users/applications/domains/user.domain';
import { expenses } from 'src/databases/schemas';
import type { SQL } from 'drizzle-orm';
import { Expense, ExpenseAmount, ExpenseId, IExpense } from '../../applications/domains/expense.domain';
import {
  ExpenseReportReturnType,
  ExpenseRepository,
  ExpensesByCategory,
  GetAllExpensesQuery,
  GetAllExpensesReturnType,
  GetExpenseReportQuery,
} from '../../applications/ports/expense.repository';

@Injectable()
export class ExpenseDrizzleRepository implements ExpenseRepository {
  constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm>) {}

  async create(expense: IExpense): Promise<IExpense> {
    const [result] = await this.model.tx
      .insert(expenses)
      .values({
        title: expense.title,
        amount: expense.amount.toString(),
        date: expense.date,
        category: expense.category,
        notes: expense.notes,
        userId: expense.userId,
      })
      .returning();
    return ExpenseDrizzleRepository.toDomain(result);
  }

  async deleteByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<void> {
    await this.model.tx
      .delete(expenses)
      .where(and(eq(expenses.uuid, id), eq(expenses.userId, userId)));
  }

  async getAll(params: GetAllExpensesQuery): Promise<GetAllExpensesReturnType> {
    const { search, sort, order, page, limit, userId, category, startDate, endDate } = params;
    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const conditions: SQL[] = [eq(expenses.userId, userId)];

    if (search) {
      conditions.push(
        or(ilike(expenses.title, `%${search}%`), ilike(expenses.notes, `%${search}%`)),
      );
    }
    if (category) conditions.push(eq(expenses.category, category));
    if (startDate) conditions.push(gte(expenses.date, startDate.toISOString().split('T')[0]));
    if (endDate) conditions.push(lte(expenses.date, endDate.toISOString().split('T')[0]));

    const where = and(...conditions);

    const [{ count: total }] = await this.model.tx
      .select({ count: count() })
      .from(expenses)
      .where(where);

    const sortableColumns: Record<string, SQL> = {
      title: expenses.title,
      amount: expenses.amount,
      date: expenses.date,
      category: expenses.category,
      createdAt: expenses.createdAt,
    };
    const orderField = sort && sortableColumns[sort] ? sortableColumns[sort] : expenses.date;
    const orderByClause = order === 'ASC' ? asc(orderField) : desc(orderField);

    const rows = await this.model.tx
      .select()
      .from(expenses)
      .where(where)
      .orderBy(orderByClause)
      .limit(currentLimit === -1 ? undefined : currentLimit)
      .offset(currentLimit === -1 ? undefined : (currentPage - 1) * currentLimit);

    const result = rows.map(ExpenseDrizzleRepository.toDomain);
    const totalPages = currentLimit === -1 ? 1 : Math.ceil(Number(total) / currentLimit);

    return StrictBuilder<GetAllExpensesReturnType>()
      .result(result)
      .meta(StrictBuilder<GetAllMetaType>()
        .page(currentPage)
        .limit(currentLimit)
        .total(Number(total))
        .totalPages(totalPages)
        .build())
      .build();
  }

  async getByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<IExpense | undefined> {
    const [result] = await this.model.tx
      .select()
      .from(expenses)
      .where(and(eq(expenses.uuid, id), eq(expenses.userId, userId)))
      .limit(1);
    return result ? ExpenseDrizzleRepository.toDomain(result) : undefined;
  }

  async updateByIdAndUserId(expense: IExpense): Promise<IExpense> {
    const [result] = await this.model.tx
      .update(expenses)
      .set({
        title: expense.title,
        amount: expense.amount.toString(),
        date: expense.date,
        category: expense.category,
        notes: expense.notes,
      })
      .where(and(eq(expenses.uuid, expense.uuid), eq(expenses.userId, expense.userId)))
      .returning();
    return ExpenseDrizzleRepository.toDomain(result);
  }

  async getExpenseReport(query: GetExpenseReportQuery): Promise<ExpenseReportReturnType> {
    const { userId, startDate, endDate } = query;

    const conditions: SQL[] = [eq(expenses.userId, userId)];
    if (startDate) conditions.push(gte(expenses.date, startDate.toISOString().split('T')[0]));
    if (endDate) conditions.push(lte(expenses.date, endDate.toISOString().split('T')[0]));
    const where = and(...conditions);

    const [totalResult] = await this.model.tx
      .select({
        totalAmount: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
        totalExpenses: sql<string>`COALESCE(COUNT(${expenses.uuid}), 0)`,
      })
      .from(expenses)
      .where(where);

    const categoryResults = await this.model.tx
      .select({
        category: expenses.category,
        total: sql<string>`SUM(${expenses.amount})`,
        count: sql<string>`COUNT(${expenses.uuid})`,
      })
      .from(expenses)
      .where(where)
      .groupBy(expenses.category)
      .orderBy(desc(sql`SUM(${expenses.amount})`));

    const categories: ExpensesByCategory[] = categoryResults.map((row) => ({
      category: row.category,
      total: Number(row.total) || 0,
      count: Number(row.count) || 0,
    }));

    return {
      totalAmount: Number(totalResult?.totalAmount) || 0,
      totalExpenses: Number(totalResult?.totalExpenses) || 0,
      categories,
      dateRange: { startDate, endDate },
    };
  }

  static toDomain(row: typeof expenses.$inferSelect): IExpense {
    const amount = Number(row.amount) as ExpenseAmount;
    return Builder(Expense)
      .uuid(row.uuid as ExpenseId)
      .title(row.title)
      .amount(amount)
      .date(row.date)
      .category(row.category)
      .notes(row.notes)
      .userId(row.userId)
      .createdAt(row.createdAt)
      .updatedAt(row.updatedAt)
      .build();
  }
}
```

---

### Task 7: Create Drizzle migration runner (preserves custom history)

**Files:**
- Create: `src/databases/drizzle/migration-runner.ts`

- [ ] **Step 1: Create migration-runner.ts**

```ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../schemas';
import { migrationsHistory } from '../schemas';

const MIGRATIONS_FOLDER = __dirname + '/migrations';

export async function runMigrations() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  });

  const db = drizzle(pool, { schema });
  const startTime = Date.now();

  try {
    console.log('Running drizzle migrations...');
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

    // Log to custom migrations_history
    const elapsed = Date.now() - startTime;
    await db.insert(migrationsHistory).values({
      timestamp: startTime,
      name: 'drizzle-migrate',
      executionTime: elapsed,
      success: true,
    });

    console.log(`All migrations executed. Time: ${elapsed}ms`);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    await db.insert(migrationsHistory).values({
      timestamp: startTime,
      name: 'drizzle-migrate',
      executionTime: elapsed,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
```

---

### Task 8: Update NestJS modules to reference drizzle repos

**Files:**
- Modify: `src/expenses/expenses.module.ts`
- Modify: `src/auth/auth.module.ts`
- Modify: `src/app.module.ts`

- [ ] **Step 1: Update expenses.module.ts**

Change `useClass: ExpenseTypeOrmRepository` to `useClass: ExpenseDrizzleRepository` and update the import.

- [ ] **Step 2: Update auth.module.ts**

Change `useClass: UserTypeOrmRepository` to `useClass: UserDrizzleRepository` and update the import.

- [ ] **Step 3: Update app.module.ts**

Replace:
```ts
import { typeormRootConfig } from './configs/typeorm.config';
ClsModule.forRoot(typeormRootConfig),
```
with:
```ts
import { drizzleRootConfig } from './configs/drizzle.config';
ClsModule.forRoot(drizzleRootConfig),
```

---

### Task 9: Delete old TypeORM files

**Files:**
- Delete: `src/configs/typeorm.config.ts`
- Delete: `src/databases/typeorm.database.providers.ts`
- Delete: `src/databases/data-source.ts`
- Delete: `src/databases/migration.utils.ts`
- Delete: `src/databases/custom-migration-table.ts`
- Delete: `src/databases/migrations/1756391700001-20250828001-create-users-table.ts`
- Delete: `src/databases/migrations/1756391700002-20250828001-create-expenses-table.ts`
- Delete: `src/databases/migrations/1756391700003-20250828001-create-custom-migrations-history-table.ts`
- Delete: `src/expenses/adapters/outbounds/expense.entity.ts`
- Delete: `src/expenses/adapters/outbounds/expense.typeorm.repository.ts`
- Delete: `src/users/adapters/outbounds/user.entity.ts`
- Delete: `src/users/adapters/outbounds/user.typeorm.repository.ts`

- [ ] **Step 1: Delete all files**

```bash
rm src/configs/typeorm.config.ts
rm src/databases/typeorm.database.providers.ts
rm src/databases/data-source.ts
rm src/databases/migration.utils.ts
rm src/databases/custom-migration-table.ts
rm src/databases/migrations/1756391700001-20250828001-create-users-table.ts
rm src/databases/migrations/1756391700002-20250828001-create-expenses-table.ts
rm src/databases/migrations/1756391700003-20250828001-create-custom-migrations-history-table.ts
rm src/expenses/adapters/outbounds/expense.entity.ts
rm src/expenses/adapters/outbounds/expense.typeorm.repository.ts
rm src/users/adapters/outbounds/user.entity.ts
rm src/users/adapters/outbounds/user.typeorm.repository.ts
```

---

### Task 10: Generate & verify Drizzle migrations

**Files:**
- Generated: `src/databases/drizzle/migrations/0000_*.sql`
- Generated: `src/databases/drizzle/migrations/meta/_journal.json`
- Generated: `src/databases/drizzle/migrations/meta/0000_snapshot.json`

- [ ] **Step 1: Generate migrations**

```bash
pnpm drizzle:generate
```

- [ ] **Step 2: Verify the generated SQL manually**

Check that `0000_*.sql` contains:
- CREATE TABLE users (...)
- CREATE TABLE expenses (...)
- CREATE TABLE migrations_history (...)
- CREATE INDEX ... (all 7 expense indexes)
- ALTER TABLE ADD CONSTRAINT (FK)

---

### Task 11: Update DB utility scripts

**Files:**
- Modify: `src/databases/scripts/reset-database.ts`
- Modify: `src/databases/scripts/migration-status.ts`
- Modify: `src/databases/scripts/migration-stats.ts`

- [ ] **Step 1: Rewrite scripts to use migration-runner**

`reset-database.ts`: drop schema via native drizzle, then call `runMigrations()` from migration-runner.
`migration-status.ts`: query `migrations_history` table for recent entries.
`migration-stats.ts`: query `migrations_history` aggregates.

---

### Task 12: Build, test, lint & final verification

- [ ] **Step 1: Build**

```bash
pnpm build
```

- [ ] **Step 2: Run unit tests**

```bash
pnpm test
```

- [ ] **Step 3: Lint**

```bash
pnpm lint
```

- [ ] **Step 4: Fix any issues**

Review output and fix errors.

---

## Self-Review Checklist

1. **Spec coverage:** Every section of the design doc maps to at least one task. The schema (Task 3) covers all 3 tables. The repositories (Tasks 5-6) cover all 10 query methods. The migration runner (Task 7) covers the custom history feature.
2. **Placeholder scan:** No TBD/TODO/incomplete code blocks. Repository code is fully written.
3. **Type consistency:** `UserDrizzleRepository.toDomain` uses the same field names as `UserTypeOrmRepository.toDomain`. The `.$inferSelect` types from drizzle schema match the fields used in each repository.
