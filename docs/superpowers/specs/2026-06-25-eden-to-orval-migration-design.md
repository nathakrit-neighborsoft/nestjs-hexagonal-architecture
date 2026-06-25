# Eden Treaty → Orval Migration Design

**Date:** 2026-06-25
**Scope:** Frontend `vite-react-tanstack-router-orval` (consumer) + Backend `nestjs-hexagonal-architecture` (OpenAPI source)
**Goal:** Replace Elysia-specific eden treaty client with orval-generated react-query hooks driven by NestJS OpenAPI at `http://localhost:9009/api-json`.

## Background

Frontend was born in the Elysia era and used `@elysiajs/eden` treaty client for end-to-end typed API access. Backend migrated to NestJS, which exposes standard OpenAPI. Eden treaty is Elysia-only and no longer works. The frontend currently has a stale `server.d.ts` (still `id:number`) and broken `api.api.drone.get()` calls.

## Design Decisions

1. **orval output = react-query hooks + retain feature wrappers.**
   Generated hooks live in `src/lib/api/generated/`. Existing `features/drones/hooks/*` become thin wrappers around generated hooks, preserving exported names (`useDrones`, `useCreateDrone`, etc.) so component code barely changes.

2. **Backend response schemas via `DroneResponseDto` + `@ApiResponse({ type })`.**
   Currently only input DTOs are annotated, so OpenAPI response bodies are untyped. We add a `DroneResponseDto` and wire it into controller response decorators so orval emits proper return types.

3. **Custom mutator replaces eden-helpers.**
   A small `src/lib/api/mutator.ts` `customInstance` (fetch + `credentials:'include'` + `VITE_API_URL` baseURL + throw on non-2xx) replaces both `eden-helpers.ts` and `client.ts`. Errors surface via react-query `query.error` / `mutation.error` (the existing components already read `dronesQuery.error`).

## Part 1 — Backend: Add Response Schemas

**Scope: drones only** (frontend uses only drones; todos/expenses can be added later when needed).

### New file: `src/drones/adapters/inbounds/dto/drone-response.dto.ts`

```ts
import { ApiProperty } from '@nestjs/swagger';

export class DroneResponseDto {
  @ApiProperty({ format: 'uuid' })
  uuid: string;

  @ApiProperty() company: string;
  @ApiProperty() model: string;
  @ApiProperty() fullName: string;
  @ApiProperty({ type: Number }) priceRTF: number;
  @ApiProperty({ type: Number }) tankCapacity: number;
  @ApiProperty({ type: Number }) flightSpeed: number;
  @ApiProperty({ type: Number }) sprayWidth: number;
  @ApiProperty({ type: Number }) coveragePerDay: number;
  @ApiProperty() rtfEquipment: string;

  @ApiProperty({ required: false }) createdAt?: Date;
  @ApiProperty({ required: false }) updatedAt?: Date;
}
```

Mirrors `IDrone` shape exactly (`uuid` not `id`).

### Edit: `src/drones/adapters/inbounds/drone.controller.ts`

Add `type: DroneResponseDto` to existing `@ApiResponse` decorators:
- `getAll` → `@ApiResponse({ status: 200, type: [DroneResponseDto] })` (array)
- `getById`, `create`, `update` → `@ApiResponse({ status: 200|201, type: DroneResponseDto })` (single)
- `delete` → no body (204), leave as-is.

### Verification

```
curl http://localhost:9009/api-json | jq '.components.schemas | keys'
# must include "DroneResponseDto"
curl http://localhost:9009/api-json | jq '.paths."/drones".get.responses."200".content'
# must reference DroneResponseDto array
```

## Part 2 — Frontend: Setup Orval

### New file: `orval.config.ts`

```ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:9009/api-json',
      filters: { tags: ['drones'] }, // skip /api/auth/*, /expenses, /todos, /health
    },
    output: {
      mode: 'tags-split',
      target: 'src/lib/api/generated',
      schemas: 'src/lib/api/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      mock: false,
      override: {
        mutator: { path: 'src/lib/api/mutator.ts', name: 'customInstance' },
        query: { useQuery: true, useInfinite: false, options: {} },
      },
    },
    hooks: { afterAllFilesWrite: 'prettier --write' },
  },
});
```

`tags: ['drones']` filter is the simplest way to avoid the better-auth catch-all `/api/auth/{path}` (8 methods), `/expenses`, `/todos`, `/health/*`. We add other tags when frontend needs them.

### New file: `src/lib/api/mutator.ts`

```ts
import { env } from '@/lib/env';

type Args = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
};

export async function customInstance<T>({ url, method, body, headers }: Args): Promise<T> {
  const res = await fetch(`${env.VITE_API_URL}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    credentials: 'include',
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type ErrorType<Error> = Error;
```

Replaces both `eden-helpers.ts` (`handleEdenResponse`) and `client.ts` (`treaty`).

### Edit: `package.json`

- Add devDep `orval`
- `scripts.gen:types` → `"orval --config ./orval.config.ts"` (replaces the eden-typed script)
- Drop `@elysiajs/eden` dependency
- Rename project to `vite-react-tanstack-router-orval`

### Edit: `.env.example`

`VITE_API_URL` stays origin-only (no `/api`); orval config already targets `/api-json` directly.

## Part 3 — Frontend: Drop Eden, Rewire Wrappers

### Delete files

- `src/lib/api/client.ts` (eden treaty)
- `src/lib/api/eden-helpers.ts` (`handleEdenResponse`)
- `src/lib/api/use-eden-query.ts`
- `src/lib/api/server.d.ts` (stale Elysia types)
- `scripts/gen-types.ts` (eden type generation)

### Edit: `src/features/drones/hooks/use-drones.ts`

Thin wrapper around generated `useGetDrones`:

```ts
import { useGetDrones } from '@/lib/api/generated/drones/drones';
export const useDrones = () => {
  const q = useGetDrones();
  return { dronesQuery: q, drones: q.data ?? [] };
};
export { dronesKeys } from '@/features/drones/api/keys';
```

### Edit: `src/features/drones/hooks/use-drone-mutations.ts`

```ts
import { useCreateDrone as useGenCreate, useUpdateDrone as useGenUpdate, useDeleteDrone as useGenDelete, ... } from '@/lib/api/generated/drones/drones';
import { useQueryClient } from '@tanstack/react-query';
import { dronesKeys } from '@/features/drones/api/keys';

export const useCreateDrone = () => {
  const qc = useQueryClient();
  return useGenCreate({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.lists() }) } });
};
// similar for update (invalidate detail + lists), delete (invalidate lists)
```

Keep exported names `useCreateDrone`, `useUpdateDrone`, `useDeleteDrone`.

### Backend-driven shape change: `id:number` → `uuid:string`

The Elysia-era shape used `id:number`. NestJS uses `ParseUUIDPipe` and the domain type is `uuid:string`. Components currently read `d.id`. Files to touch:

- `src/features/drones/components/DroneList.tsx` — `d.id` → `d.uuid`
- `src/features/drones/components/DroneFormDialog.tsx` — id param type `number` → `string`
- `src/features/drones/components/DeleteDroneDialog.tsx` — id param type
- `src/features/drones/components/DroneForm.tsx` — type def `id?: number` → `id?: string` (or rename to `uuid`)
- `src/features/drones/api/keys.ts` — `detail(id: number)` → `detail(uuid: string)`
- `src/routes/drone.tsx` — loader uses `params.id` as `string` (already string from URL), switch from `api.api.drone.get()` to `useGetDrone` or call via a small helper / generated `getDrone` query. Confirm string-vs-number type matches.

### Edit: tests

- `src/routes/drone.test.tsx` — was mocking `@/lib/api/eden-helpers`. Rewrite mock to target `@/lib/api/mutator` or the generated module. Reuse existing fixture drone shape, switch `id: 1` → `uuid: '...'`.
- `src/features/drones/components/DroneList.test.tsx` — update fixture if it references `id`.

## Error Model Shift

- Eden returned `{ data, error }` tuples. Existing code called `handleEdenResponse` to unwrap.
- New mutator throws on non-2xx. React-query stores thrown error in `query.error` / `mutation.error`.
- Components already read `dronesQuery.error` so display behavior is preserved; only the source of the error object changes.

## Risks & Assumptions

- **Backend must be running** when orval runs (it hits `localhost:9009/api-json`). Document this in README / `gen:types` script.
- **CORS** is already `['*']` + credentials:true on the backend, so fetch-with-credentials from Vite dev server works without changes.
- **`tags-split` mode** creates `src/lib/api/generated/drones/drones.ts`. Verify import path in wrapper edits.
- **better-auth** lives at `/api/auth/*` and is unrelated to eden; `auth-client.ts` stays as-is.
- **Existing tests** may break on shape change (`id` → `uuid`); plan to run vitest after Part 3.

## Out of Scope

- Migrating todos / expenses on the frontend (not used yet).
- Touching backend swagger for non-drones endpoints.
- Replacing better-auth client.
- Backend test additions (DroneResponseDto is a plain DTO; no behavior to test).

## Verification Plan

1. **Backend:** `curl localhost:9009/api-json` shows `DroneResponseDto` in schemas and in 200/201 response bodies.
2. **Generation:** `bun run gen:types` succeeds; `src/lib/api/generated/drones/drones.ts` exists with `useGetDrones` / `useCreateDrone` / etc.
3. **Typecheck:** `bun run typecheck` (or `tsc --noEmit`) passes with no `id:number` leftovers.
4. **Tests:** `bun run test` — update fixtures for `uuid`, ensure mocks target new mutator.
5. **Manual smoke:** start Vite, open `/drones`, list renders, create works, delete works, detail route loads.
