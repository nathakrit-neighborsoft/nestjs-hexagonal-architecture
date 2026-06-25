# ai-spec.md — Order Processing

> **Goal:** Generate a production‑ready, minimal Order Processing platform on AWS using **API Gateway + Lambda (Node 20/TS)** + **DynamoDB (single‑table)** + **SQS** (+ optional **DynamoDB Streams**). Focus on clean architecture, tests (Vitest), IaC via **Serverless Framework v3** with `serverless-esbuild` & `serverless-offline`.

---

## 1) Non‑Functional Requirements
- **Runtime:** Node.js 20, TypeScript strict.
- **Architecture:** Serverless, event‑driven, single‑table DynamoDB, idempotent handlers.
- **Latency target:** p95 < 300ms for CRUD endpoints under light load.
- **Reliability:** Safe writes (ConditionExpression), retries with DLQ for async jobs.
- **Security:** IAM least‑privilege, input validation, basic auth (JWT) stubbed.
- **Observability:** AWS Lambda Powertools (logger/metrics/tracing) + structured logs.
- **Testing:** Vitest for unit & integration. Local stack via `serverless-offline` + DynamoDB Local.

---

## 2) Scope (MVP)
### Sync HTTP API (API Gateway → Lambda)
- **POST /orders** – create order (items, amounts, customerId). Returns created order.
- **GET /orders/{orderId}** – fetch order detail.
- **GET /customers/{customerId}/orders** – list orders by customer.
- **PATCH /orders/{orderId}** – update status (e.g., PENDING → PAID → SHIPPED → CANCELED).

### Async Flow (Event Driven)
- On **Create Order**: publish compact event to **SQS** `order-events-queue` (type: `ORDER_CREATED`).
- Optional: **DynamoDB Streams** trigger for audit/replication.
- Optional: **EventBridge (cron)** for daily cleanup/report.

### Out of Scope (MVP)
- Payments gateway integration (mock only).
- Real authentication (provide JWT stub & middleware placeholder).
- Inventory reservation (mock).

---

## 3) Data Model — DynamoDB Single Table
**Table:** `orders_app`
- **PK (partition key):** `pk` (string)
- **SK (sort key):** `sk` (string)
- **GSI1:** `gsi1pk` + `gsi1sk` (to list orders by customer & by createdAt).

### Entities (denormalized)
- **Order Detail**
  - Key: `pk = ORDER#{orderId}`, `sk = DETAIL`
  - Body: `{ orderId, customerId, status, amount, currency, items[], createdAt, updatedAt }`
  - GSI1: `gsi1pk = ORDER#{orderId}`, `gsi1sk = DETAIL` (optional)
- **Order by Customer (index row)**
  - Key: `pk = CUSTOMER#{customerId}`, `sk = ORDER#{orderId}`
  - Body (summary): `{ orderId, customerId, status, amount, createdAt }`
  - GSI1: `gsi1pk = CUST_ORDERS#{customerId}`, `gsi1sk = {createdAt}#{orderId}` for time‑ordered listing.

### Access Patterns
- Get order detail → `GetItem(ORDER#{id}, DETAIL)`
- List orders of customer → `Query(pk = CUSTOMER#{customerId}, begins_with(sk, 'ORDER#'))`
- Time‑sorted list → `Query GSI1 where gsi1pk = CUST_ORDERS#{customerId} ORDER BY gsi1sk DESC`

### Write Consistency & Idempotency
- **Create:** `ConditionExpression attribute_not_exists(pk)` to avoid overwrite.
- **Update status:** condition current `status` to valid transitions.
- **Idempotency key:** accept `Idempotency-Key` header (persist to DDB with TTL).


## 4) IaC — Serverless Framework
- Plugins: `serverless-esbuild`, `serverless-offline`, `serverless-iam-roles-per-function`.
- Provider: `nodejs20.x`, region `ap-southeast-1`, arch `arm64`.
- Environment vars: `TABLE_NAME`, `QUEUE_URL`, optional `GSI1_NAME`.
- IAM per‑function: only the DDB + SQS actions needed.
- Resources: create DynamoDB table & SQS queue (and DLQ) in `resources:`.