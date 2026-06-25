# Better Auth Migration

## Goal

Replace Passport JWT + custom auth use cases with Better Auth (same as `elysia-remote-dts-back-end`).

## Migration Decisions

- **Scope**: Full migration (remove Passport, use cases, JWT config, User module)
- **DB**: Drop `users` table, create Better Auth tables (`user`, `session`, `account`, `verification`)
- **Mount**: NestJS controller `@All('*')` wildcard → converts Express req to Web API `Request` → `auth.handler()`
- **Guard**: Custom `AuthGuard` → converts `request.headers` to `Headers` → `auth.api.getSession()`

## File Changes

### Added
- `src/auth/auth.ts` — Better Auth instance + Drizzle adapter
- `src/auth/auth.controller.ts` — `@Controller('api/auth') @All('*')`
- `src/auth/auth.guard.ts` — Session-based auth guard
- `src/auth/auth.token.ts` — DI token constant
- `src/databases/schemas/auth.schema.ts` — `user`, `session`, `account`, `verification` tables
- `src/configs/better-auth.config.ts` — Env config

### Deleted
- `src/auth/usecases/` (login/register use cases + specs)
- `src/auth/jwtStrategy.ts`, `src/auth/jwtAuth.guard.ts`
- `src/auth/adapters/` (old controller + DTOs)
- `src/users/` (entire module: domain, port, repo, module)
- `src/databases/schemas/users.schema.ts`
- `src/configs/jwt.config.ts`, `src/configs/auth.config.ts`

### Updated
- `src/auth/auth.module.ts` — Provide `auth` instance, `AuthGuard`
- `src/app.module.ts` — Remove `UserModule`
- `src/databases/schemas/index.ts` — Export auth schemas
- `src/databases/schemas/expenses.schema.ts` — FK → `user.id` (text)
- `src/databases/schemas/todos.schema.ts` — FK → `user.id` (text)
- `src/expenses/adapters/inbounds/expense.controller.ts` — `AuthGuard`, `req.user.id`
- `src/todos/adapters/inbounds/todo.controller.ts` — `AuthGuard`
- `src/drones/adapters/inbounds/drone.controller.ts` — `AuthGuard`
- `src/configs/swagger.config.ts` — Remove bearer auth config
- `src/types/utility.type.ts` — Add `UserId` type
- `env.example` — Better Auth vars
- `package.json` — `better-auth` dep, remove passport/argon2

## Verification

- TypeScript: 0 errors
- Tests: 47 pass, 0 fail
- Lint: 0 errors
- Build: clean
