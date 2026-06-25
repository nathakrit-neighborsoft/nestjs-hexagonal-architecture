# Eden Treaty → Orval Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Elysia-specific eden treaty client on the frontend with orval-generated react-query hooks driven by the NestJS backend OpenAPI spec, plus expose response schemas on the backend so the generated types carry return shapes.

**Estimated tasks:** 8 | **Estimated time:** ~90 min | **Touches:** Backend (NestJS drones) / Frontend (api layer + drone feature + routes)

## Current Problem / Current Solution

The frontend `vite-react-tanstack-router-orval` was built when the backend was Elysia and used `@elysiajs/eden` for end-to-end typed API access. The backend has since migrated to NestJS which exposes a standard OpenAPI spec at `/api-json`. Eden treaty is Elysia-only and no longer works. The frontend still carries a stale `server.d.ts` (typed `id:number` from the Elysia era) and broken `api.api.drone.get()` calls in `routes/drone.tsx`. The backend annotates only input DTOs (`CreateDroneDto`, `UpdateDroneDto`), so even if the frontend switched to a generic OpenAPI client, response bodies would be untyped.

## Proposed Approach

Add a `DroneResponseDto` and wire it into `DroneController`'s `@ApiResponse` decorators so OpenAPI exposes response schemas. Then on the frontend, configure orval to generate react-query hooks from the live spec into `src/lib/api/generated/`, swap the eden treaty client for a small fetch-based custom mutator (`src/lib/api/mutator.ts`), thin out the existing feature wrapper hooks to delegate to generated hooks, and fix the shape change `id:number` → `uuid:string` (NestJS uses `ParseUUIDPipe`). Errors move from eden's `{data,error}` tuple to react-query's `query.error` / `mutation.error`, which components already read.

## Side by Side

| Scenario | Before | After |
| -------- | ------ | ----- |
| Frontend API client | `@elysiajs/eden` treaty client + `handleEdenResponse` unwrap | orval-generated react-query hooks + `customInstance` mutator |
| Backend response types | Only input DTOs annotated; responses untyped | `DroneResponseDto` + `@ApiResponse({ type })` on drones |
| Drone identifier on frontend | `id: number` (Elysia era) | `uuid: string` (NestJS `ParseUUIDPipe`) |
| Error surfacing | eden `{data,error}` tuple, manually unwrapped | mutator throws; react-query `query.error` |
| Regenerating types | `scripts/gen-types.ts` (eden) | `bun run gen:types` → `orval` |

## Assumptions & Risks

- **Assumed:** Backend runs at `http://localhost:9009` during `gen:types` (orval fetches `/api-json` live).
- **Assumed:** Backend CORS (`['*']` + credentials) already permits the Vite dev origin — verified earlier, no change needed.
- **Assumed:** orval `tags-split` mode produces `src/lib/api/generated/drones/drones.ts`. If the actual layout differs, wrapper import paths must be adjusted in Task 4.
- **Assumed:** Generated hook names follow orval react-query convention (`useGetDrones`, `useGetDrone`, `useCreateDrone`, `useUpdateDrone`, `useDeleteDrone`). Will be verified in Task 2.
- **Risk:** If the backend is not running during `gen:types`, generation fails. Mitigation: document the prerequisite in the script comment.
- **Risk:** Existing tests mock `@/lib/api/eden-helpers`; deleting it breaks the mock. Task 6 rewrites the mock.
- **Risk:** Shape change (`id` → `uuid`) is broad; missed call sites will surface as typecheck errors. Task 5 + final typecheck catches them.

## Impact

- Frontend no longer depends on `@elysiajs/eden` (Elysia-coupled).
- Frontend drone types now match NestJS domain (`uuid: string`), eliminating the stale `id:number`.
- OpenAPI consumers (frontend now; others later) get typed response bodies for `/drones`.
- Future endpoints (todos / expenses) can be added by widening the orval tag filter — one config line.

---

## Task Overview

1. **Backend: Add `DroneResponseDto` and wire controller responses** — annotate drones responses for OpenAPI
2. **Frontend: Add orval + custom mutator** — install tooling, write config and `customInstance`
3. **Frontend: Generate hooks from OpenAPI** — run `bun run gen:types`, verify output layout
4. **Frontend: Drop eden files** — delete treaty client + helpers + stale types
5. **Frontend: Rewire drone feature hooks** — thin wrappers over generated hooks
6. **Frontend: Shape change `id:number` → `uuid:string`** — fix all call sites in components and keys
7. **Frontend: Rewrite route loader + tests** — replace eden loader, fix mocks and fixtures
8. **Frontend: Rename package, drop eden dep, final verification** — clean `package.json`, typecheck, test, smoke

---

### Task 1: Backend — Add `DroneResponseDto` and wire controller responses

**Files:**

- Create: `src/drones/adapters/inbounds/dto/drone-response.dto.ts`
- Modify: `src/drones/adapters/inbounds/drone.controller.ts`

- [ ] **Step 1: Create `DroneResponseDto`**

File `src/drones/adapters/inbounds/dto/drone-response.dto.ts`:

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

Mirrors `IDrone` exactly (`uuid` not `id`).

- [ ] **Step 2: Edit `drone.controller.ts` — import + annotate responses**

Add to imports:

```ts
import { DroneResponseDto } from './dto/drone-response.dto';
```

Add / extend `@ApiResponse` on each method (keep existing `@ApiTags`, `@ApiOperation`, etc.):

- `getAll()` → `@ApiResponse({ status: 200, type: [DroneResponseDto] })`
- `getById()` → `@ApiResponse({ status: 200, type: DroneResponseDto })`
- `create()` → `@ApiResponse({ status: 201, type: DroneResponseDto })`
- `update()` → `@ApiResponse({ status: 200, type: DroneResponseDto })`
- `delete()` → leave 204 response unchanged (no body).

Do **not** change handlers, status codes, or guards.

- [ ] **Step 3: Start/restart the backend and verify the spec**

Run the backend (e.g. `pnpm start:dev` in another shell or rely on running instance). Verify:

```bash
curl -s http://localhost:9009/api-json | jq '.components.schemas | keys'
# expect "DroneResponseDto" in the list

curl -s http://localhost:9009/api-json | jq '.paths."/drones".get.responses."200".content'
# expect schema referencing DroneResponseDto array

curl -s http://localhost:9009/api-json | jq '.paths."/drones/{id}".get.responses."200".content'
# expect schema referencing DroneResponseDto (single)
```

- [ ] **Step 4: Commit (optional, local only — never push)**

```bash
git add src/drones/adapters/inbounds/dto/drone-response.dto.ts src/drones/adapters/inbounds/drone.controller.ts
git commit -m "feat(drones): add DroneResponseDto and annotate controller responses"
```

---

### Task 2: Frontend — Add orval + custom mutator

**Repo:** `vite-react-tanstack-router-orval` (workdir changes for this task).

**Files:**

- Create: `src/lib/api/mutator.ts`
- Create: `orval.config.ts`
- Modify: `package.json` (scripts + devDep; dep rename handled in Task 8)

- [ ] **Step 1: Create the custom mutator**

File `src/lib/api/mutator.ts`:

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

- [ ] **Step 2: Create `orval.config.ts`**

File `orval.config.ts` (repo root):

```ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:9009/api-json',
      filters: { tags: ['drones'] },
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

- [ ] **Step 3: Install orval as devDep and add the gen script**

```bash
bun add -d orval
```

Edit `package.json` `scripts`:

- Replace existing `gen:types` value with `"orval --config ./orval.config.ts"`.
- Keep other scripts intact.

If a `scripts/gen-types.ts` script is referenced anywhere (it will be deleted in Task 4), leave the dangling reference for now; Task 4 deletes the file after the new script works.

- [ ] **Step 4: Run generation and verify output**

(Requires backend running at `localhost:9009`, see Task 1.)

```bash
bun run gen:types
```

Verify:

```bash
ls src/lib/api/generated/drones/
# expect drones.ts (hooks) and possibly model files

grep -E 'export (const|function) use(Get|Create|Update|Delete)Drone' src/lib/api/generated/drones/drones.ts
# confirm hook names
```

Record actual hook names for Task 5 (especially singular `useGetDrone` vs `useGetDroneById`).

- [ ] **Step 5: Commit (optional, local only)**

```bash
git add src/lib/api/mutator.ts orval.config.ts package.json bun.lockb src/lib/api/generated/
git commit -m "feat(api): add orval config, custom mutator, generated drone hooks"
```

---

### Task 3: Frontend — Generate hooks from OpenAPI

This task is the verification gate between setup (Task 2) and removal (Task 4). If Task 2 Step 4 produced the expected files, this task is already done — keep it explicit so the worker does not skip the check.

- [ ] **Step 1: Confirm generated tree**

```bash
find src/lib/api/generated -type f
```

Expected: `drones/drones.ts`, `models/<schema>.ts` for each referenced schema (incl. `DroneResponseDto`, `CreateDroneDto`, `UpdateDroneDto`).

- [ ] **Step 2: Capture exact exported hook + type names**

```bash
grep -E '^export (const|function|type|interface)' src/lib/api/generated/drones/drones.ts
```

Note the exact names for: list hook, detail hook, create mutation, update mutation, delete mutation, and the response type (e.g. `DroneResponseDTO` vs `DroneResponseDto`). The plan below assumes `useGetDrones`, `useGetDrone`, `useCreateDrone`, `useUpdateDrone`, `useDeleteDrone`, type `DroneResponseDTO`. Adjust in Task 5 / Task 6 if orval emits different casing.

---

### Task 4: Frontend — Drop eden files

**Files:**

- Delete: `src/lib/api/client.ts`
- Delete: `src/lib/api/eden-helpers.ts`
- Delete: `src/lib/api/use-eden-query.ts`
- Delete: `src/lib/api/server.d.ts`
- Delete: `scripts/gen-types.ts`

- [ ] **Step 1: Delete the five files**

```bash
rm src/lib/api/client.ts src/lib/api/eden-helpers.ts src/lib/api/use-eden-query.ts src/lib/api/server.d.ts scripts/gen-types.ts
```

If `scripts/` is now empty, leave the empty directory (no need to delete the folder).

- [ ] **Step 2: Find dangling references**

```bash
grep -rn "lib/api/client\|lib/api/eden-helpers\|lib/api/use-eden-query\|lib/api/server\|scripts/gen-types" src
```

Any hit must be fixed before typecheck will pass. Expected hits: `src/features/drones/hooks/*` (Task 5), `src/routes/drone.tsx` (Task 7), `src/routes/drone.test.tsx` (Task 7).

- [ ] **Step 3: Commit (optional, local only)**

```bash
git add -A
git commit -m "chore(api): remove eden treaty client and stale types"
```

---

### Task 5: Frontend — Rewire drone feature hooks

**Files:**

- Modify: `src/features/drones/hooks/use-drones.ts`
- Modify: `src/features/drones/hooks/use-drone-mutations.ts`
- Modify: `src/features/drones/api/keys.ts`

- [ ] **Step 1: Fix `keys.ts` shape change (`id:number` → `uuid:string`)**

File `src/features/drones/api/keys.ts`:

```ts
export const dronesKeys = {
  all: ['drones'] as const,
  lists: () => [...dronesKeys.all, 'list'] as const,
  details: () => [...dronesKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...dronesKeys.details(), uuid] as const,
};
```

(Adjust to match existing style if the file uses different method names.)

- [ ] **Step 2: Rewrite `use-drones.ts` as a thin wrapper**

File `src/features/drones/hooks/use-drones.ts`:

```ts
import { useGetDrones } from '@/lib/api/generated/drones/drones';

export const useDrones = () => {
  const dronesQuery = useGetDrones();
  return { dronesQuery, drones: dronesQuery.data ?? [] };
};
```

Keep the same return shape that consumers already destructure.

If consumers also need a `useDrone(uuid)` (detail) hook from this file, add it similarly using the generated detail hook.

- [ ] **Step 3: Rewrite `use-drone-mutations.ts` with cache invalidation**

File `src/features/drones/hooks/use-drone-mutations.ts`:

```ts
import { useQueryClient } from '@tanstack/react-query';
import {
  useCreateDrone as useGenCreate,
  useUpdateDrone as useGenUpdate,
  useDeleteDrone as useGenDelete,
} from '@/lib/api/generated/drones/drones';
import { dronesKeys } from '@/features/drones/api/keys';

export const useCreateDrone = () => {
  const qc = useQueryClient();
  return useGenCreate({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.lists() }) },
  });
};

export const useUpdateDrone = () => {
  const qc = useQueryClient();
  return useGenUpdate({
    mutation: {
      onSuccess: (_data, vars) => {
        // vars must include the uuid path param; adjust key based on actual signature
        qc.invalidateQueries({ queryKey: dronesKeys.lists() });
      },
    },
  });
};

export const useDeleteDrone = () => {
  const qc = useQueryClient();
  return useGenDelete({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: dronesKeys.lists() }) },
  });
};
```

Adjust the `useUpdateDrone` invalidation key once the generated mutation variable shape is known (Task 3 Step 2). If the generated hook names differ, swap them here.

- [ ] **Step 4: Typecheck the api layer**

```bash
bun run typecheck
```

Expected remaining errors: components in Task 6 still referencing `d.id`, route loader in Task 7 still using eden. Address those in their tasks.

- [ ] **Step 5: Commit (optional, local only)**

```bash
git add src/features/drones/hooks/ src/features/drones/api/keys.ts
git commit -m "refactor(drones): rewire hooks over orval-generated queries"
```

---

### Task 6: Frontend — Shape change `id:number` → `uuid:string`

**Files:**

- Modify: `src/features/drones/components/DroneList.tsx`
- Modify: `src/features/drones/components/DroneFormDialog.tsx`
- Modify: `src/features/drones/components/DeleteDroneDialog.tsx`
- Modify: `src/features/drones/components/DroneForm.tsx`

- [ ] **Step 1: Locate every call site**

```bash
grep -rn '\bid\b' src/features/drones/components
```

Also grep `\.id` on drone objects and any `id: number` type annotation in these files.

- [ ] **Step 2: Edit each file**

For each file:

- Rename prop / param `id: number` → `uuid: string` (or `id: string` if the component already calls it `id` everywhere; pick one and be consistent — prefer `uuid` to match the domain).
- Change `drone.id` → `drone.uuid`.
- Update `DroneForm.tsx` type def `id?: number` → `uuid?: string` (or drop the field if the form never submits it).

- [ ] **Step 3: Typecheck components**

```bash
bun run typecheck
```

Expect only `routes/drone.tsx` and `routes/drone.test.tsx` errors to remain — handled in Task 7.

- [ ] **Step 4: Commit (optional, local only)**

```bash
git add src/features/drones/components/
git commit -m "refactor(drones): switch drone identifier from id:number to uuid:string"
```

---

### Task 7: Frontend — Rewrite route loader + tests

**Files:**

- Modify: `src/routes/drone.tsx`
- Modify: `src/routes/drone.test.tsx`
- Modify: `src/features/drones/components/DroneList.test.tsx` (only if it references `id` or eden)

- [ ] **Step 1: Replace eden loader in `routes/drone.tsx`**

The current loader uses `api.api.drone.get()` + `handleEdenResponse`. Replace with a fetch via the mutator, or — preferred when the generated query exposes a `getDrone` / `getDroneQueryKey` helper — use that helper to prefetch in the loader.

Minimal approach (if no prefetch helper is wired):

```ts
import { customInstance } from '@/lib/api/mutator';

// inside createLazyRoute / loader:
const drone = await customInstance({ url: `/drones/${params.uuid}`, method: 'GET' });
return { drone };
```

Adjust the param name to match the route (`:uuid` vs `:id`); if the route param is still `:id`, the value is already a string from the URL, just typed accordingly.

- [ ] **Step 2: Rewrite the `routes/drone.test.tsx` mock**

Replace the `vi.mock('@/lib/api/eden-helpers', ...)` block with a mock of `@/lib/api/mutator`:

```ts
vi.mock('@/lib/api/mutator', () => ({
  customInstance: vi.fn().mockResolvedValue({ uuid: 'drone-1', company: 'ACME', /* full shape */ }),
}));
```

Update any fixture drone shape in the test from `id: 1` to `uuid: 'drone-1'`.

- [ ] **Step 3: Fix `DroneList.test.tsx` if needed**

```bash
grep -n '\bid\b\|eden-helpers' src/features/drones/components/DroneList.test.tsx
```

If hits: update fixture shape to `uuid`, drop eden-helpers mock, mock generated hook or mutator instead.

- [ ] **Step 4: Run the test suite**

```bash
bun run test
```

Fix any remaining mock or shape mismatches until green.

- [ ] **Step 5: Commit (optional, local only)**

```bash
git add src/routes/drone.tsx src/routes/drone.test.tsx src/features/drones/components/DroneList.test.tsx
git commit -m "test(drones): rewrite eden mocks and fix uuid shape in tests"
```

---

### Task 8: Frontend — Rename package, drop eden dep, final verification

**Files:**

- Modify: `package.json`
- Modify: `.env.example` (only if it mentions eden)

- [ ] **Step 1: Drop `@elysiajs/eden` and rename the package**

Edit `package.json`:

- Remove `"@elysiajs/eden"` from `dependencies`.
- Change `"name"` from `vite-react-tanstack-router-eden` to `vite-react-tanstack-router-orval`.

```bash
bun install
```

- [ ] **Step 2: Update `.env.example` if it mentions eden**

```bash
grep -n 'eden\|elysia' .env.example
```

If hits: rewrite those lines to describe `VITE_API_URL` as origin-only (no `/api`).

- [ ] **Step 3: Full typecheck**

```bash
bun run typecheck
```

No errors expected.

- [ ] **Step 4: Full test suite**

```bash
bun run test
```

All green.

- [ ] **Step 5: Regenerate to confirm idempotency**

```bash
bun run gen:types
```

No diff beyond formatting. If diff appears, inspect and fix the config.

- [ ] **Step 6: Manual smoke (browser)**

Start backend + Vite dev server. Open `/drones`:

- List renders with seeded drones.
- Create dialog submits, list refreshes.
- Edit dialog updates, detail reflects change.
- Delete removes row.
- Open drone detail route (`/drones/:uuid`) — loads without 500.

- [ ] **Step 7: Commit (optional, local only)**

```bash
git add package.json bun.lockb .env.example
git commit -m "chore: rename package to vite-react-tanstack-router-orval, drop @elysiajs/eden"
```

---

## Completion Criteria

- `curl http://localhost:9009/api-json` lists `DroneResponseDto` and references it on `/drones` GET/POST/PUT responses.
- `bun run gen:types` succeeds and emits `src/lib/api/generated/drones/drones.ts`.
- No references to `@elysiajs/eden`, `lib/api/client`, `lib/api/eden-helpers`, `lib/api/use-eden-query`, `lib/api/server`, or `scripts/gen-types` remain anywhere in `src`.
- `bun run typecheck` passes.
- `bun run test` passes.
- Manual smoke: list / create / update / delete / detail all work in the browser.
