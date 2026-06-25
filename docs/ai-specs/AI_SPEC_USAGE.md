# AI Specification Usage Guide

## Files Created

### 1. `ai-agent-spec.md`

**Purpose**: Comprehensive AI agent specification for the current NestJS Hexagonal Architecture project.

**When to use**:

- When you need to understand the overall project structure
- Before making major architectural changes
- When onboarding new developers or AI agents
- As a reference for project-wide standards and conventions

**Key sections**:

- Project overview and technologies
- Architecture patterns and module structure
- Code generation principles and guidelines
- Development workflow and best practices

### 2. `ai-module-template-spec.md`

**Purpose**: Reusable template and step-by-step guide for creating new modules.

**When to use**:

- When creating any new domain module (e.g., Orders, Payments, Notifications)
- To ensure consistency across all modules
- As a checklist for module development completion
- When training team members on the architecture

**Key sections**:

- Complete module structure template
- Step-by-step implementation guide
- Code templates for all layers
- Testing strategy and checklist

### 3. `docs/ai-specs/unit-test-spec.md`

**Purpose**: Comprehensive specification for writing unit tests with 100% coverage for UseCase and Domain classes.

**When to use**:

- When writing unit tests for any UseCase classes
- When testing Domain classes that contain business logic methods
- To ensure consistent testing patterns across the codebase
- For achieving 100% test coverage on UseCases and Domain methods

**Key sections**:

- UseCase testing templates and patterns
- Domain testing guidelines and templates
- Mock verification patterns
- Test data generation with Faker.js
- Complete examples and best practices

## How to Use These Specifications

### For AI Agents

1. **Always read the main spec first** (`ai-agent-spec.md`) to understand the project context
2. **Use the module template** (`ai-module-template-spec.md`) when creating new modules
3. **Use the unit test spec** (`docs/ai-specs/unit-test-spec.md`) when writing tests for UseCases and Domains
4. **Follow the established patterns** rather than creating new ones
5. **Maintain consistency** with existing code style and architecture

### For Developers

1. **Reference the main spec** for understanding project standards
2. **Use the module template as a checklist** when implementing new features
3. **Follow the unit test spec** for writing comprehensive tests with 100% coverage
4. **Follow the naming conventions** and file organization patterns
5. **Ensure all tests are written** according to the testing strategy

### For Future Module Creation

When creating a new module (example: "Orders"), follow these steps:

1. **Plan the module** using the pre-development checklist
2. **Replace placeholders** in templates:
   - `{MODULE_NAME}` → `orders`
   - `{ENTITY_NAME}` → `Order`
3. **Follow the implementation steps** in the exact order specified
4. **Write comprehensive unit tests** using `docs/ai-specs/unit-test-spec.md` for UseCases and Domain classes
5. **Use the final checklist** to ensure completion
6. **Run quality verification commands** before considering the module complete

## Quick Reference

### Module Structure Pattern

```text
src/{module-name}/
├── adapters/
│   ├── inbounds/     # Controllers, DTOs
│   └── outbounds/    # Entities, Repositories
├── applications/
│   ├── domains/      # Business Logic
│   ├── ports/        # Interfaces
│   └── usecases/     # Application Logic
└── {module}.module.ts
```

### Command Quick Reference

```bash
# Development
pnpm install          # Install dependencies
pnpm dev              # Start development server
pnpm build            # Build project

# Testing
pnpm test             # Run unit tests
pnpm test:cov         # Test with coverage
pnpm test:e2e         # End-to-end tests

# Quality
pnpm lint             # Check code style
pnpm format           # Format code

# Database
pnpm migration:generate -- --name=CreateSomethingTable
pnpm migration:run
```

## TDD Workflow

- Write UseCase tests first using patterns from `docs/ai-specs/unit-test-spec.md`.
- Run tests in watch mode: `pnpm test:watch` and ensure they fail initially (Red).
- Implement minimal UseCase logic to make tests pass (Green).
- Refactor while keeping tests green; add Domain tests only when adding domain methods.
- After UseCases are green, implement adapters (entities/repositories) and controllers; then add integration/E2E tests.

## Examples

### Creating a "Products" module (already exists, but as reference)

1. Domain: `ProductDomain` with business rules
2. Port: `ProductRepository` interface
3. Use Cases: `CreateProductUseCase`, `GetProductByIdUseCase`, etc.
4. Outbound: `ProductEntity`, `ProductTypeormRepository`
5. Inbound: `ProductController`, DTOs
6. Module: `ProductModule` with proper DI configuration

### Creating a new "Orders" module

1. Replace `{MODULE_NAME}` with `orders`
2. Replace `{ENTITY_NAME}` with `Order`
3. Follow all template steps
4. Register in `AppModule`
5. Create migration for `OrderEntity`

---

These specifications ensure consistent, maintainable, and scalable code that follows hexagonal architecture principles while leveraging NestJS best practices.
