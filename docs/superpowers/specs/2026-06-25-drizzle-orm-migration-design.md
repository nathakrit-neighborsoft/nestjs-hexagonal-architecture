# Drizzle ORM Migration Design

**Date:** 2026-06-25
**Project:** nestjs-hexagonal-architecture
**Status:** Draft (pending user review)

## Goal

Migrate the persistence layer from **TypeORM** to **Drizzle ORM** without changing
the hexagonal architecture, public API, or business logic. Use cases and ports
stay untouched. Only `adapters/outbounds/` plus the database/config layer change.

## Non-Goals

- No change to controllers, use cases, domain types, or repository interfaces.
- No switch of the database engine (PostgreSQL stays).
- No introduction of e2e tests (none exist today).
- No PG schema redesign — table names, columns, types, indexes, FK behaviour
  stay byte-identical to the current TypeORM definitions so the dev DB can be
  reset & re-seeded in place.

## Stack Changes

| Concern | Remove (TypeORM) | Add (Drizzle) |
|---|---|---|
| ORM core | `typeorm@^0.3.25` | `drizzle-orm@latest` |
| NestJS glue | `@nestjs/typeorm@^11.0.0` | — (no official `@nestjs/drizzle`, use plain `drizzle` provider) |
| Migrations CLI | `typeorm-ts-node-esm` (in scripts) | `drizzle-kit@latest` |
| CLS tx adapter | `@nestjs-cls/transactional-adapter-typeorm@^1.3.0` | `nestjs-cls-transactional-adapter-drizzle-orm@latest` |
| Postgres driver | `pg@^8.16.3` (kept) | `pg` (kept) |
| Stale deps | `@nestjs/sequelize`, `sequelize`, `sequelize-typescript`, `@types/sequelize` | — (deleted) |
| TS types | — | `drizzle-kit` (devDep) |

`@nestjs-cls/transactional` and `nestjs-cls` stay (the adapter changes, the API
surface that repositories consume stays the same: `TransactionHost<...>`).

## File-Level Plan

### New files

```
src/databases/schemas/
  index.ts                       # barrel: schema + db types
  users.schema.ts                # drizzle pgTable('users', ...)
  expenses.schema.ts             # drizzle pgTable('expenses', ...) + FK
  migrations-history.schema.ts   # custom history table (replaces custom-migration-table.ts)

src/configs/
  drizzle.config.ts              # drizzle config + ClsModule.forRoot

src/databases/
  drizzle.database.providers.ts  # provides DrizzleDB + DATA_SOURCE token
  database.module.ts (rewrite)   # uses drizzle providers

src/databases/drizzle/
  migrations/                    # generated SQL + meta/_journal.json
  migration-runner.ts            # wraps drizzle migrate() + history logging

src/expenses/adapters/outbounds/
  expense.drizzle.repository.ts  # implements ExpenseRepository

src/users/adapters/outbounds/
  user.drizzle.repository.ts     # implements UserRepository

drizzle.config.ts                # drizzle-kit config at project root
```

### Modified files

```
package.json                      # swap deps, refresh scripts
src/app.module.ts                 # ClsModule.forRoot(drizzleRootConfig)
src/databases/database.module.ts  # use drizzle providers
src/databases/scripts/            # reset-database, migration-status, migration-stats → use runner
src/expenses/expenses.module.ts   # useClass: ExpenseDrizzleRepository
src/auth/auth.module.ts           # useClass: UserDrizzleRepository
README.md, src/databases/README.md, docs/ai-specs/ai-migration-spec.md # docs refresh
```

### Deleted files

```
src/configs/typeorm.config.ts
src/databases/typeorm.database.providers.ts
src/databases/data-source.ts
src/databases/migration.utils.ts
src/databases/custom-migration-table.ts
src/databases/migrations/1756391700001-20250828001-create-users-table.ts
src/databases/migrations/1756391700002-20250828001-create-expenses-table.ts
src/databases/migrations/1756391700003-20250828001-create-custom-migrations-history-table.ts
src/expenses/adapters/outbounds/expense.entity.ts
src/expenses/adapters/outbounds/expense.typeorm.repository.ts
src/users/adapters/outbounds/user.entity.ts
src/users/adapters/outbounds/user.typeorm.repository.ts
```

## Drizzle Schema (key shapes)

`users` — same columns, same unique index on `email`, same `createdAt`/`updatedAt`
timestamps. `expenses` — same columns, same FK `user_id → users.uuid` with
`ON DELETE CASCADE ON UPDATE CASCADE`, same composite indexes
(`user_id`, `user_id+category`, `user_id+date`, `user_id+category+date`, `date`,
`category`, `createdAt`).

`migrations_history` — matches the current custom table:
`id`, `timestamp` (bigint), `name` (varchar), `executed_at` (timestamp),
`execution_time` (int), `success` (boolean), `error_message` (text),
`created_at`, `updated_at`.

UUID generation stays as `gen_random_uuid()` (Postgres pgcrypto), matching the
current `default: 'gen_random_uuid()'` on the PK column. Drizzle's `defaultRandom()`
emits the same SQL.

## Repository Mapping (TypeORM → Drizzle)

| Operation | TypeORM | Drizzle |
|---|---|---|
| Insert | `repo.save(entity)` | `db.insert(t).values(data).returning()` |
| Find by PK + FK | `repo.findOne({ where: { uuid, userId } })` | `db.select().from(t).where(and(eq(t.uuid,id),eq(t.userId,uid))).limit(1)` |
| Delete by condition | `repo.delete({ uuid, userId })` | `db.delete(t).where(and(...))` |
| Update partial | `repo.update({ uuid, userId }, partial)` | `db.update(t).set(partial).where(and(...)).returning()` |
| List + count + sort + paginate | `qb.where/andWhere/orderBy/skip/take/getManyAndCount()` | `db.select().from(t).where(...).orderBy(...).limit().offset()` + parallel `db.select({c: count()})` |
| Aggregates (sum/count/groupBy) | `qb.select('SUM(...)').addSelect('COUNT(...)').groupBy().getRawMany()` | `db.select({...}).from(t).where(...).groupBy(t.category)` with `sql\`SUM(...)\`` |
| ILIKE search | `qb.andWhere('expense.title ILIKE :s', { s: '%x%' })` | `or(ilike(t.title, s), ilike(t.notes, s))` from `drizzle-orm` |

`toDomain` static helpers stay; the new entity rows (drizzle `infer` types) feed
the same `Builder(Expense)` / `Builder(User)` calls.

## CLS Transaction Adapter

Repositories keep their current constructor signature pattern — only the generic
type changes:

```ts
// before
constructor(private readonly model: TransactionHost<TransactionalAdapterTypeOrm>) {}
// after
constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm>) {}
```

Internally `this.model.tx` becomes the Drizzle instance (`NodePgDatabase<typeof schema>`).
`ClsModule.forRoot` in `drizzle.config.ts` wires the new adapter the same way the
TypeORM adapter was wired — using a token exported from the drizzle provider.

## Custom Migration Runner (preserves observability)

Why: drizzle-orm's built-in `migrate()` only writes to `__drizzle_migrations`
(no exec time, no success flag, no error capture). User wants the existing
`migrations_history` feature preserved.

Flow of `migration-runner.ts`:

1. Build a `pg` Pool from `env`, create drizzle instance.
2. Read `meta/_journal.json` → list of all migration entries with `when` + `tag`.
3. Read `__drizzle_migrations` table → set of `hash` already applied.
4. Compute pending = journal entries whose hash is not in the applied set.
5. For each pending migration, in order:
   - record start timestamp
   - call `migrate(db, { migrationsFolder })` with a per-file filter
     (drizzle's migrator only takes a folder; we run it once, then re-check
     what got applied since last call)
   - on success: `INSERT INTO migrations_history (timestamp, name, execution_time, success, executed_at)`
   - on failure: `INSERT INTO migrations_history (... success=false, error_message=...)` then rethrow
6. `db.$client.end()` in `finally`.

This keeps the "run, log, fail-fast" behaviour identical to the current
`MigrationUtils.runMigrations()` and feeds the same `db:status` / `db:stats`
scripts (rewritten to read from `migrations_history`).

The drizzle `__drizzle_migrations` table is kept as Drizzle needs it to track
applied hashes; it's separate from `migrations_history` (which is for humans/observability).
The `migrations_history` table itself is a regular drizzle table, created by the
generated migration 0001 so it lives in the same migration flow as everything else.

## Migrations (SQL)

1. `pnpm drizzle-kit generate` after schema files exist → produces
   `src/databases/drizzle/migrations/0000_*.sql` + `meta/_journal.json` + `meta/0000_snapshot.json`.
2. Manually verify generated SQL matches expected tables/indexes/FK.
3. `db:reset` script: drop → run runner (creates everything from generated SQL).
4. No hand-written SQL migrations — relies on `drizzle-kit generate` for drift-free diffs.

## CLI Scripts (package.json)

| Old | New |
|---|---|
| `migration:generate` | `drizzle:generate` → `drizzle-kit generate` |
| `migration:create`  | removed (drizzle-kit doesn't have a no-op create) |
| `migration:run`     | `drizzle:migrate` → runner script |
| `migration:revert`  | `drizzle:revert` → manual `drizzle-kit drop` + custom revert (drizzle has no first-class revert; we mark history rows as reverted) |
| `migration:show`    | `drizzle:status` → `db:status` script |
| `schema:drop`       | `drizzle:drop` → `drizzle-kit drop` |
| `schema:sync`       | removed (drizzle discourages sync) |
| `db:reset`          | kept → drops & re-runs runner |
| `db:status`         | kept → reads `migrations_history` |
| `db:stats`          | kept → reads `migrations_history` aggregates |

## Verification

- `pnpm install` (clean install) — confirms deps resolve, no stale typeorm pulls.
- `pnpm build` (tsc via nest build) — typecheck must pass.
- `pnpm test` (vitest) — repos are mocked via ports; no DB needed. All existing
  use-case specs must pass without modification.
- `pnpm lint` (oxlint) — passes.
- `pnpm db:reset` against local PG → 3 tables exist with correct columns/indexes/FK.
- `pnpm db:status` → shows 3 migrations with success=true.
- `pnpm db:stats` → returns aggregate numbers.
- Manual: start app, hit `/auth/register` + `/expenses` endpoints, confirm round-trip.

## Risks & Assumptions

- **Drizzle doesn't ship a NestJS module.** DI is done with a plain `useFactory`
  provider (same pattern the current TypeORM provider uses). No new abstraction.
- **`drizzle-kit` doesn't ship a programmatic migrate()** beyond what
  `drizzle-orm/node-postgres/migrator` exposes. The custom runner wraps that.
- **No production data migration is in scope.** Dev DB is dropped & re-created
  via `db:reset`. If the project ever has prod data, a separate
  "typeorm→drizzle data" plan would be needed; out of scope here.
- **Vitest specs use `mock<ExpenseRepository>()`** — ports unchanged, so specs
  compile and pass as-is.
- **UUID default** — `defaultRandom()` in drizzle emits `gen_random_uuid()`
  which depends on `pgcrypto` (already enabled by `init.sql`).
- **Lockfile churn** — removing sequelize stack + typeorm + @nestjs/typeorm +
  the old CLS adapter will rewrite a big chunk of `pnpm-lock.yaml`. Expected.

## Out of Scope (Explicit)

- No Drizzle Relations API (`relations` / `with`) — queries stay explicit to match
  the existing QB-style code 1:1.
- No use of `drizzle-orm/relations` helpers — they would force changes in
  domain types and ports.
- No soft-delete, no audit columns beyond what already exists.
