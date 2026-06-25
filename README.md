# 💰 Expense Tracker API

A modern expense tracking RESTful API built with NestJS, TypeORM, and PostgreSQL. This application follows Clean Architecture principles (Hexagonal Architecture) to ensure maintainability, testability, and separation of concerns.

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Protected routes with JWT guards
- Secure password hashing with Argon2

### 💸 Expense Management

- **CRUD Operations**: Create, read, update, and delete expenses
- **Advanced Filtering**: Filter expenses by category, date range, and search terms
- **Sorting & Pagination**: Sort by various fields with pagination support
- **Expense Reports**: Generate reports grouped by category with date filtering
- **User Isolation**: Each user can only access their own expenses

### 📊 API Documentation

- Interactive Swagger/OpenAPI documentation
- Comprehensive API endpoint documentation
- Request/Response schema validation

### 🏗️ Architecture & Quality

- **Clean Architecture**: Hexagonal Architecture pattern
- **Domain-Driven Design**: Clear separation of concerns
- **TypeScript**: Full type safety
- **Branded Types**: Type-safe identifiers and domain objects
- **Testing**: Comprehensive test coverage with Vitest
- **Logging**: Structured logging with Pino
- **Linting**: Code quality with Oxlint
- **CI/CD**: Automated versioning with Semantic Release

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v22+)
- **pnpm** (recommended) or npm
- **PostgreSQL** (v15+)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nathakritbc/expense_tracker_api.git
   cd expense_tracker_api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Application
   NODE_ENV=development
   PORT=9009

   # Database Configuration
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=expense_tracker

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=1d

   # Password Hashing
   ARGON2_MEMORY_COST=19456
   ```

4. **Database Setup**

   Create a PostgreSQL database:

   ```sql
   CREATE DATABASE expense_tracker;
   ```

5. **Database Migration**

   Run database migrations to set up the required tables:

   ```bash
   pnpm run migration:run
   ```

6. **Start the application**

   Development mode:

   ```bash
   pnpm run dev
   ```

   Production mode:

   ```bash
   pnpm run build
   pnpm run start:prod
   ```

6. **Start the application**

   Development mode:

   ```bash
   pnpm run dev
   ```

   Production mode:

   ```bash
   pnpm run build
   pnpm run start:prod
   ```

## 📖 API Documentation

### Live API Testing

The API is available for testing at: **https://expense-tracker-api-yvb7.onrender.com/**

- **Swagger UI**: `https://expense-tracker-api-yvb7.onrender.com/api`
- **Health Check**: `https://expense-tracker-api-yvb7.onrender.com/`

### Local Development

Once the application is running locally, visit:

- **Swagger UI**: `http://localhost:9009/api`
- **Health Check**: `http://localhost:9009`

### 🔑 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | User login |

### 💰 Expense Endpoints

All expense endpoints require JWT authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses with filtering & pagination |
| POST | `/expenses` | Create a new expense |
| GET | `/expenses/:id` | Get expense by ID |
| PUT | `/expenses/:id` | Update expense by ID |
| DELETE | `/expenses/:id` | Delete expense by ID |
| GET | `/expenses/reports/by-category` | Get expense report by category |

#### Query Parameters for `/expenses`

- `search`: Search in title and notes
- `category`: Filter by expense category
- `startDate`: Filter expenses from this date (YYYY-MM-DD)
- `endDate`: Filter expenses until this date (YYYY-MM-DD)
- `sort`: Sort field (title, amount, date, category)
- `order`: Sort order (ASC, DESC)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Example API Usage

#### Testing with Live API

All examples below can be tested against the live API at `https://expense-tracker-api-yvb7.onrender.com/`

#### 1. Register a new user

```bash
curl -X POST https://expense-tracker-api-yvb7.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response:**
```json
{
  "id": "user-id",
  "email": "test@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Login

```bash
curl -X POST https://expense-tracker-api-yvb7.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "securePassword123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "test@example.com"
  }
}
```

#### 3. Create an expense

```bash
curl -X POST https://expense-tracker-api-yvb7.onrender.com/expenses \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lunch at restaurant",
    "amount": 250.50,
    "category": "Food",
    "date": "2024-01-15",
    "notes": "Team lunch meeting"
  }'
```

**Expected Response:**
```json
{
  "id": "expense-id",
  "title": "Lunch at restaurant",
  "amount": 250.50,
  "category": "Food",
  "date": "2024-01-15",
  "notes": "Team lunch meeting",
  "userId": "user-id",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 4. Get all expenses

```bash
curl -X GET https://expense-tracker-api-yvb7.onrender.com/expenses \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 5. Get expenses with filtering

```bash
curl -X GET "https://expense-tracker-api-yvb7.onrender.com/expenses?category=Food&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 6. Get expense by ID

```bash
curl -X GET https://expense-tracker-api-yvb7.onrender.com/expenses/expense-id \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 7. Update an expense

```bash
curl -X PUT https://expense-tracker-api-yvb7.onrender.com/expenses/expense-id \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated lunch expense",
    "amount": 300.00,
    "category": "Food",
    "date": "2024-01-15",
    "notes": "Updated team lunch meeting"
  }'
```

#### 8. Delete an expense

```bash
curl -X DELETE https://expense-tracker-api-yvb7.onrender.com/expenses/expense-id \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 9. Get expense report by category

```bash
curl -X GET "https://expense-tracker-api-yvb7.onrender.com/expenses/reports/by-category?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Expected Response:**
```json
{
  "reports": [
    {
      "category": "Food",
      "totalAmount": 550.50,
      "count": 2
    },
    {
      "category": "Transport",
      "totalAmount": 150.00,
      "count": 1
    }
  ],
  "totalExpenses": 700.50,
  "totalCount": 3
}
```

### Testing with JavaScript/Node.js

```javascript
// Example using fetch API
const API_BASE = 'https://expense-tracker-api-yvb7.onrender.com';

// Register user
const registerResponse = await fetch(`${API_BASE}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'securePassword123'
  })
});

// Login
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'securePassword123'
  })
});

const { access_token } = await loginResponse.json();

// Create expense
const createExpenseResponse = await fetch(`${API_BASE}/expenses`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    title: 'Lunch at restaurant',
    amount: 250.50,
    category: 'Food',
    date: '2024-01-15',
    notes: 'Team lunch meeting'
  })
});
```

### Testing with Postman

1. **Import the collection** or create new requests
2. **Set base URL**: `https://expense-tracker-api-yvb7.onrender.com`
3. **Authentication**: Use Bearer Token in Authorization header
4. **Test endpoints**:
   - `POST /auth/register`
   - `POST /auth/login`
   - `GET /expenses`
   - `POST /expenses`
   - `GET /expenses/{id}`
   - `PUT /expenses/{id}`
   - `DELETE /expenses/{id}`
   - `GET /expenses/reports/by-category`

### Local Development Examples

For local development, replace the base URL with `http://localhost:9009`:

```bash
# Register a new user
curl -X POST http://localhost:9009/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'

# Login
curl -X POST http://localhost:9009/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com", 
    "password": "securePassword123"
  }'

# Create an expense
curl -X POST http://localhost:9009/expenses \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lunch at restaurant",
    "amount": 250.50,
    "category": "Food",
    "date": "2024-01-15",
    "notes": "Team lunch meeting"
  }'

# Get expenses with filtering
curl -X GET "http://localhost:9009/expenses?category=Food&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Error Handling

The API returns standard HTTP status codes and error messages:

#### Common HTTP Status Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| `200` | Success | Request completed successfully |
| `201` | Created | New resource created successfully |
| `400` | Bad Request | Invalid request data |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists (e.g., email already registered) |
| `422` | Unprocessable Entity | Validation errors |
| `500` | Internal Server Error | Server error |

#### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "email must be an email"
    },
    {
      "field": "password",
      "message": "password should not be empty"
    }
  ]
}
```

#### Common Error Scenarios

**1. Invalid JWT Token:**
```bash
curl -X GET https://expense-tracker-api-yvb7.onrender.com/expenses \
  -H "Authorization: Bearer invalid-token"
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**2. Email Already Exists:**
```bash
curl -X POST https://expense-tracker-api-yvb7.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

**3. Invalid Expense Data:**
```bash
curl -X POST https://expense-tracker-api-yvb7.onrender.com/expenses \
  -H "Authorization: Bearer <valid-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "amount": -100,
    "category": "InvalidCategory"
  }'
```

**Response:**
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "details": [
    {
      "field": "title",
      "message": "title should not be empty"
    },
    {
      "field": "amount",
      "message": "amount must be a positive number"
    },
    {
      "field": "category",
      "message": "category must be one of the following values: Food, Transport, Entertainment, Shopping, Health, Education, Other"
    }
  ]
}
```

### Testing Checklist

When testing the API, make sure to verify:

- [ ] **Authentication**: Register and login work correctly
- [ ] **JWT Token**: Token is received and can be used for authenticated requests
- [ ] **CRUD Operations**: Create, read, update, delete expenses
- [ ] **Filtering**: Search, category filter, date range filter
- [ ] **Pagination**: Page and limit parameters work
- [ ] **Sorting**: Sort by different fields
- [ ] **Reports**: Category-based expense reports
- [ ] **Error Handling**: Invalid requests return appropriate error codes
- [ ] **Validation**: Required fields and data types are validated
- [ ] **User Isolation**: Users can only access their own expenses

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server with hot reload |
| `pnpm run build` | Build the application |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run code linting |
| `pnpm run test` | Run tests |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run test:cov` | Run tests with coverage |

### Project Structure

```text
src/
├── auth/                    # Authentication module
│   ├── adapters/
│   │   └── inbounds/       # Controllers and DTOs
│   ├── usecases/           # Business logic
│   └── auth.module.ts
├── expenses/                # Expense management module
│   ├── adapters/
│   │   ├── inbounds/       # Controllers and DTOs
│   │   └── outbounds/      # Repositories and entities
│   ├── applications/
│   │   ├── domains/        # Domain models
│   │   ├── ports/          # Interfaces
│   │   └── usecases/       # Business logic
│   └── expenses.module.ts
├── users/                   # User management module
├── databases/               # Database configuration
├── configs/                 # Application configuration
├── utils/                   # Utility functions
└── main.ts                 # Application entry point
```

### Architecture

This project follows **Hexagonal Architecture** (Ports and Adapters):

- **Domain Layer**: Core business logic and entities (`applications/domains/`)
- **Application Layer**: Use cases and business rules (`applications/usecases/`)
- **Infrastructure Layer**: External concerns like databases (`adapters/outbounds/`)
- **Interface Layer**: Controllers and DTOs (`adapters/inbounds/`)

### Testing

The project uses **Vitest** for testing:

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# View coverage report
open coverage/index.html
```

### Code Quality

- **TypeScript**: Strong typing for better development experience
- **Oxlint**: Fast linting for code quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

## 🚢 Deployment

### Environment Variables for Production

Make sure to set the following environment variables in production:

```env
NODE_ENV=production
PORT=9009
DB_HOST=your-prod-db-host
DB_PORT=5432
DB_USERNAME=your-prod-username
DB_PASSWORD=your-secure-password
DB_DATABASE=expense_tracker_prod
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=24h
```

## 🐳 Docker Deployment

This project includes comprehensive Docker support for both development and production environments.

### Quick Start with Docker

1. **Clone and setup:**
   ```bash
   git clone https://github.com/nathakritbc/expense_tracker_api.git
   cd expense_tracker_api
   make setup
   ```

2. **Or manually:**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Start development environment
   make dev
   
   # Or start production environment
   make prod
   ```

### Available Docker Commands

```bash
# Development
make dev          # Start development environment
make dev-logs     # View development logs
make dev-shell    # Open development shell

# Production
make prod         # Start production environment
make prod-logs    # View production logs
make prod-shell   # Open production shell

# Management
make stop         # Stop all containers
make status       # Show container status
make clean        # Remove all containers and volumes
make build        # Build all Docker images

# Database
make migrate      # Run database migrations manually
make db-status    # Show migration status
make db-reset     # Reset database

# Health checks
make health       # Check application health
```

### Docker Services

- **API**: NestJS application (port 9009) - runs migrations automatically in production
- **PostgreSQL**: Database (port 5432)
- **Nginx**: Reverse proxy (port 80/443) - production only

### Environment Configuration

Copy `env.example` to `.env` and configure your environment variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=expense_tracker

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Application
NODE_ENV=development
PORT=9009
```

For detailed Docker deployment instructions, see [README-Docker.md](README-Docker.md).

## ☸️ Kubernetes Deployment

This repo now includes a minimal Kubernetes setup in `k8s/` suitable for production-like deployments. It deploys the API, a ClusterIP Service, and optional Postgres via StatefulSet, plus an example Ingress.

### Prerequisites
- A Kubernetes cluster and `kubectl` configured
- A container registry to push your API image
- Optional: Ingress controller (e.g., NGINX Ingress) if using `k8s/ingress.yaml`

### 1) Build and push the image
```bash
# Build
docker build -t <registry>/expense-tracker-api:<tag> .

# Push
docker push <registry>/expense-tracker-api:<tag>
```

Update the image in `k8s/deployment.yaml` at `spec.template.spec.containers[0].image`.

### 2) Apply base manifests
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

By default, the app expects Postgres host `postgres` in the same namespace. You have two options:

#### Option A: Use managed/external Postgres (recommended)
- Edit `k8s/secret.yaml` and set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` to your external DB
- Apply: `kubectl apply -f k8s/secret.yaml -n expense-tracker`

#### Option B: Run Postgres in-cluster
```bash
kubectl apply -f k8s/postgres.yaml
```

This creates a `StatefulSet` with a 5Gi PVC. Adjust storage class and size as needed.

### 3) (Optional) Ingress
Edit host in `k8s/ingress.yaml` and apply:
```bash
kubectl apply -f k8s/ingress.yaml
```

### 4) Verify
```bash
kubectl get pods -n expense-tracker
kubectl logs -n expense-tracker deploy/expense-tracker-api
kubectl port-forward -n expense-tracker svc/expense-tracker-api 9009:80
```
Visit `http://localhost:9009/health`.

### Notes
- Health probes use `/health` on port 9009.
- Logging/telemetry include k8s metadata via env (`POD_NAME`, `POD_NAMESPACE`, `NODE_NAME`).
- To enable OTLP export, set `OTLP_EXPORTER_URL` in `k8s/configmap.yaml` to your collector endpoint.


## 📝 Release Management

This project uses [Semantic Release](https://semantic-release.gitbook.io/) for automated versioning and changelog generation.

### Commit Message Convention

Follow [Conventional Commits](https://conventionalcommits.org/) specification:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `perf`: Performance improvement (patch version bump)
- `refactor`: Code refactoring (patch version bump)
- `docs`: Documentation changes (no release)
- `style`: Code style changes (no release)
- `test`: Test changes (no release)
- `build`: Build system changes (patch version bump)
- `ci`: CI configuration changes (patch version bump)

#### Examples

```bash
feat: add expense filtering by date range
fix: resolve null pointer exception in expense calculation
feat!: migrate to new authentication system (breaking change)
docs: update API documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the commit message convention
4. Make your changes and add tests
5. Ensure all tests pass (`pnpm run test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under **nathakritbc**.

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

#### JWT Authentication Failed

- Check if `JWT_SECRET` is set in environment variables
- Verify token format: `Authorization: Bearer <token>`
- Check if token hasn't expired

#### Port Already in Use

- Change `PORT` in `.env` file
- Kill process using the port: `lsof -ti:9009 | xargs kill -9`

### Support

If you encounter any issues or have questions:

1. Check existing [GitHub Issues](link-to-issues)
2. Review the API documentation at `/api`
3. Check application logs for error details

---

## Built with ❤️

NestJS, TypeORM, and PostgreSQL
