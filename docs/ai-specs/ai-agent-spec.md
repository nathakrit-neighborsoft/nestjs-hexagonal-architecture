# AI Agent Specification - NestJS Hexagonal Architecture Project

## Project Overview

This is a **NestJS application** implementing **Hexagonal Architecture (Ports and Adapters)** with **TypeORM** as the primary ORM. The project demonstrates clean architecture principles with clear separation of concerns between business logic, infrastructure, and presentation layers.

### Key Technologies & Dependencies
- **Framework**: NestJS v11
- **Database ORM**: TypeORM v0.3.25 
- **Database**: PostgreSQL (via pg driver)
- **Authentication**: JWT with Passport.js & Argon2 for hashing
- **Documentation**: Swagger/OpenAPI
- **Testing**: Vitest with coverage
- **Logging**: Pino with nestjs-pino
- **Validation**: class-validator & class-transformer
- **Linting**: OXLint
- **Package Manager**: PNPM (preferred)
- **Transaction Management**: @nestjs-cls/transactional with TypeORM adapter

## Architecture Patterns

### Hexagonal Architecture Structure
Each domain module follows this consistent structure:

```
src/{module-name}/
├── adapters/
│   ├── inbounds/           # Controllers, DTOs, HTTP adapters
│   │   ├── {entity}.controller.ts
│   │   ├── {operation}.dto.ts
│   │   └── {entity}.http (HTTP files)
│   └── outbounds/          # Database entities, repository implementations
│       ├── {entity}.entity.ts
│       └── {entity}.typeorm.repository.ts
├── applications/
│   ├── domains/            # Domain models and business logic
│   │   ├── {entity}.domain.ts
│   │   └── {entity}.domain.spec.ts
│   ├── ports/              # Repository interfaces (contracts)
│   │   └── {entity}.repository.ts
│   └── usecases/           # Business use cases
│       ├── {operation}.usecase.ts
│       └── {operation}.usecase.spec.ts
└── {module}.module.ts      # Module definition
```

### Existing Modules
1. **Users Module** - User management with authentication
2. **{Entity}s Module** - {Entity} catalog management  
3. **Auth Module** - Authentication and authorization
4. **Database Module** - Database configuration and connections

## AI Agent Guidelines

### Code Generation Principles
1. **Follow Hexagonal Architecture**: Always maintain the clear separation between adapters, applications, and domains
2. **Use TypeScript**: Leverage strong typing throughout the application
3. **Apply SOLID Principles**: Ensure single responsibility, dependency inversion, etc.
4. **Test-Driven Approach**: Generate corresponding test files (.spec.ts) for all business logic
5. **Use Dependency Injection**: Leverage NestJS DI container properly

### Module Creation Workflow
When creating new modules, follow this sequence:

#### 1. Domain Layer (Core Business Logic)
- Create domain entity with business rules
- Write domain tests
- Define repository port (interface)

#### 2. Application Layer (Use Cases)
- Implement use cases that orchestrate domain operations
- Write use case tests
- Ensure use cases depend only on ports, not concrete implementations

#### 3. Adapter Layer (Infrastructure & Presentation)
- **Outbound Adapters**: Create TypeORM entities and repository implementations
- **Inbound Adapters**: Create controllers, DTOs, and API endpoints
- Generate Swagger documentation

#### 4. Module Registration
- Create NestJS module with proper provider binding
- Register in AppModule
- Configure any necessary middleware or guards

### Code Conventions

#### File Naming
- **Domains**: `{entity}.domain.ts`
- **Use Cases**: `{operation}{Entity}.usecase.ts`
- **Controllers**: `{entity}.controller.ts`
- **DTOs**: `{operation}{Entity}.dto.ts`
- **Entities**: `{entity}.entity.ts`
- **Repositories**: `{entity}.typeorm.repository.ts`
- **Repository Ports**: `{entity}.repository.ts`
- **Tests**: `{filename}.spec.ts`

#### Class Naming
- **Domains**: `{Entity}Domain`
- **Use Cases**: `{Operation}{Entity}UseCase`
- **Controllers**: `{Entity}Controller`
- **DTOs**: `{Operation}{Entity}Dto`
- **Entities**: `{Entity}Entity`
- **Repositories**: `{Entity}TypeormRepository`
- **Repository Ports**: `{Entity}Repository`

#### Import Organization
Use the prettier-plugin-organize-imports to automatically organize imports:
1. Node.js built-in modules
2. External libraries
3. Internal modules (relative imports)

#### Validation & Transformation
- Use `class-validator` decorators in DTOs
- Apply `class-transformer` for data transformation
- Enable global validation pipe with whitelist and transform options

#### Object Construction & Types
- Use `builder-pattern` for constructing objects instead of object literals.
  - Example (assignment):
    - BAD: `const todo: ITodo = { id: 1, title: 'todo1' }`
    - GOOD:
      `const todo = Builder<ITodo>().id(1).title('todo1').build();`
  - Example (return):
    - BAD: `return { id: 1, title: 'todo1' } as ITodo;`
    - GOOD:
      `return Builder<ITodo>().id(1).title('todo1').build();`
- Do not use the spread operator `...` (objects or arrays). Prefer explicit fields or Builder chaining.
- Do not use `any`. Use precise types, generics, `unknown` with narrowing, or branded types as appropriate.

### Database & Entity Guidelines
- Use TypeORM decorators for entity mapping
- Follow repository pattern with clear interfaces
- Implement proper transaction management using @nestjs-cls/transactional
- Use UUID for primary keys when appropriate
- Apply proper indexing strategies
- **Migration Naming**: Use timestamp-based naming (e.g., `1756391900904-CreatePostsTable.ts`)
- **Column Types**: Always specify proper types with constraints (`varchar(length)`, `text`, `decimal(precision, scale)`)
- **Indexes**: Create indexes for foreign keys, search fields, and frequently queried columns
- **Constraints**: Use proper `isNullable`, `isUnique`, and `default` values
- **Rollback**: Implement proper rollback logic in migration `down()` method

### Testing Standards
- **Unit Tests**: Test business logic in isolation
- **Integration Tests**: Test adapter implementations
- **E2E Tests**: Test complete user journeys
- Use Vitest as the testing framework
- Mock external dependencies properly
- Achieve good test coverage (aim for >80%)

### TDD Workflow
- Red → Green → Refactor: write a failing test first, make it pass with minimal code, then refactor safely.
- Start with UseCase specs in `applications/usecases` before implementing the UseCase.
- Add Domain specs in `applications/domains` only when the domain contains business methods.
- Keep tests focused (AAA: Arrange, Act, Assert) and independent from infrastructure.
- Run tests continuously with `pnpm test:watch`; check coverage with `pnpm test:cov`.

### Authentication & Authorization
- Use JWT tokens with Passport.js strategy
- Implement proper guards for route protection
- Hash passwords with Argon2
- Apply role-based access control when needed

### API Documentation
- Use Swagger decorators on controllers and DTOs
- Provide comprehensive API documentation
- Include authentication schemes in Swagger config
- Document error responses properly

### Error Handling
- Create custom exception classes when needed
- Use appropriate HTTP status codes
- Provide meaningful error messages
- Log errors appropriately with Pino logger

### Configuration Management
- Use @nestjs/config for environment variables
- Separate configuration by concern (database, auth, http, etc.)
- Validate configuration schemas
- Support different environments (development, production, test)

### Performance Considerations
- Implement proper caching strategies when needed
- Use database indexing appropriately
- Apply pagination for list endpoints
- Consider query optimization for complex operations

## Development Workflow

### Adding New Features (TDD-First)
1. Define domain requirements
2. Write UseCase tests first (failing) using patterns from `docs/ai-specs/unit-test-spec.md`
3. Implement minimal UseCase logic to pass tests
4. Add/adjust Domain with business rules if needed, and write Domain tests for methods
5. Refactor code keeping tests green
6. Implement adapters (entities/repositories)
7. Add API endpoints with proper validation
8. Update Swagger documentation
9. Add integration/E2E tests
10. Update module configurations

### Code Quality Checks
- Run `pnpm lint` for linting
- Run `pnpm test` for unit tests
- Run `pnpm test:cov` for coverage reports
- Run `pnpm test:e2e` for end-to-end tests
- Use Prettier for code formatting

### Database Migration Commands
- `pnpm run migration:create -- src/databases/migrations/Create{Entity}Table` - Create empty migration
- `pnpm run migration:generate -- --name=Create{Entity}Table` - Generate from entity changes
- `pnpm run migration:run` - Apply pending migrations
- `pnpm run migration:revert` - Rollback last migration
- `pnpm run migration:show` - Show migration status
- `pnpm run db:status` - Check database connection and migration status

### Database Migrations
- Create TypeORM migrations for schema changes
- Test migrations in development environment
- Apply migrations in production safely
- **Migration Templates**: Use the standardized migration templates from `docs/ai-specs/ai-migration-spec.md` for consistent database schema management
- **Migration Naming**: Follow timestamp-based naming convention (e.g., `1756391900904-CreatePostsTable.ts`)
- **Column Constraints**: Always specify proper types, lengths, and constraints
- **Performance**: Add appropriate indexes for query optimization
- **Rollback Safety**: Ensure `down()` method properly reverses all changes

## Common Patterns & Examples

### Domain Pattern
```typescript
import { Brand, CreatedAt, Status, UpdatedAt } from 'src/types/utility.type';

export type {Entity}Id = Brand<string, '{Entity}Id'>;
export type {Entity}Name = Brand<string, '{Entity}Name'>;
export type {Entity}Price = Brand<number, '{Entity}Price'>;
export type {Entity}Description = Brand<string, '{Entity}Description'>;
export type {Entity}Image = Brand<string, '{Entity}Image'>;
export type {Entity}CreatedAt = Brand<CreatedAt, '{Entity}CreatedAt'>;
export type {Entity}UpdatedAt = Brand<UpdatedAt, '{Entity}UpdatedAt'>;

export interface I{Entity} {
  uuid: {Entity}Id;
  name: {Entity}Name;
  price: {Entity}Price;
  description?: {Entity}Description;
  status: Status;
  image?: {Entity}Image;
  createdAt?: {Entity}CreatedAt;
  updatedAt?: {Entity}UpdatedAt;
}

export class {Entity} implements I{Entity} {
  uuid: {Entity}Id;
  name: {Entity}Name;
  price: {Entity}Price;
  description?: {Entity}Description;
  status: Status;
  image?: {Entity}Image;
  createdAt?: {Entity}CreatedAt;
  updatedAt?: {Entity}UpdatedAt;
}
```

### Create Entity Pattern

```typescript

export const {entity}TableName = '{entity}s';

@Entity({
  name: {entity}TableName,
})
export class {Entity}Entity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'uuid',
    default: 'gen_random_uuid()',
  })
  uuid: {Entity}Id;

  @Column({
    type: 'varchar',
  })
  name: {Entity}Name;

  @Column({
    type: 'float',
  })
  price: {Entity}Price;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: {Entity}Description;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image?: {Entity}Image;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: Status;

  @CreateDateColumn()
  declare createdAt: {Entity}CreatedAt;

  @UpdateDateColumn()
  declare updatedAt: {Entity}UpdatedAt;
}
```


### Repository Implementation Pattern
```typescript 

// Port (Interface)
import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { I{Entity}, {Entity}Id } from '../domains/{entity}.domain';

export type Create{Entity}Command = Omit<I{Entity}, 'uuid' | 'status' | 'createdAt' | 'updatedAt'>;

export interface GetAllReturnType {
  result: I{Entity}[];
  meta: GetAllMetaType;
}

const {entity}RepositoryTokenSymbol: unique symbol = Symbol('{Entity}Repository');
export const {entity}RepositoryToken = {entity}RepositoryTokenSymbol.toString();

export interface {Entity}Repository {
  create({entity}: Create{Entity}Command): Promise<I{Entity}>;
  deleteById(id: {Entity}Id): Promise<void>;
  getAll(params: GetAllParamsType): Promise<GetAllReturnType>;
  getById(id: {Entity}Id): Promise<I{Entity} | undefined>;
  updateById(id: {Entity}Id, {entity}: Partial<I{Entity}>): Promise<I{Entity}>;
}

// Adapter (Implementation)
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
import {
  I{Entity},
  {Entity},
  {Entity}CreatedAt,
  {Entity}Description,
  {Entity}Id,
  {Entity}Image,
  {Entity}Name,
  {Entity}Price,
  {Entity}UpdatedAt,
} from 'src/{entity}s/applications/domains/{entity}.domain';
import {
  Create{Entity}Command,
  GetAllReturnType,
  {Entity}Repository,
} from 'src/{entity}s/applications/ports/{entity}.repository';
import { GetAllMetaType, GetAllParamsType, type Status } from 'src/types/utility.type';
import { {Entity}Entity } from './{entity}.entity';
@Injectable()
export class {Entity}TypeOrmRepository implements {Entity}Repository {
  constructor(private readonly {entity}Model: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create({entity}: Create{Entity}Command): Promise<I{Entity}> {
    const resultCreated = await this.{entity}Model.tx.getRepository({Entity}Entity).save({
      name: {entity}.name,
      price: {entity}.price,
      description: {entity}.description,
      image: {entity}.image,
    });
    return {Entity}TypeOrmRepository.toDomain(resultCreated as {Entity}Entity);
  }

  async deleteById(id: {Entity}Id): Promise<void> {
    await this.{entity}Model.tx.getRepository({Entity}Entity).delete({ uuid: id });
  }

  async getAll(params: GetAll{Entity}Query): Promise<GetAll{Entity}ReturnType> {
    const { search, sort, order, page, limit, userId, category, startDate, endDate } = params;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const repo = this.{entity}Model.tx.getRepository({Entity}Entity);
    const qb = repo.createQueryBuilder('{entity}');

    // Always filter by user
    qb.where('{entity}.userId = :userId', { userId });

    //Search (case-insensitive)
    if (search) {
      qb.andWhere('({entity}.title ILIKE :search OR {entity}.notes ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Category filter
    if (category) {
      qb.andWhere('{entity}.category = :category', { category });
    }

    // Date range filter
    if (startDate) {
      qb.andWhere('{entity}.date >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      qb.andWhere('{entity}.date <= :endDate', { endDate: new Date(endDate) });
    }

    // Sorting (safe whitelist)
    const sortableColumns = ['title', 'amount', 'date', 'category', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      qb.orderBy(`{entity}.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    } else {
      qb.orderBy('{entity}.date', 'DESC'); // default
    }

    // Pagination (support -1 = all)
    if (currentLimit !== -1) {
      qb.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    // Execute query
    const [{entity}s, count] = await qb.getManyAndCount();

    // Map to domain objects
    const result = {entity}s.map(({entity}) => {Entity}TypeOrmRepository.toDomain({entity}));

    // Meta info
    const totalPages = currentLimit === -1 ? 1 : Math.ceil(count / currentLimit);
    const meta = StrictBuilder<GetAllMetaType>()
      .page(currentPage)
      .limit(currentLimit)
      .total(count)
      .totalPages(totalPages)
      .build();

    return StrictBuilder<GetAll{entity}sReturnType>().result(result).meta(meta).build();
  }

  async getById(id: {Entity}Id): Promise<I{Entity} | undefined> {
    const {entity} = await this.{entity}Model.tx.getRepository({Entity}Entity).findOne({
      where: {
        uuid: id,
      },
    });
    return {entity} ? {Entity}TypeOrmRepository.toDomain({entity}) : undefined;
  }

  async updateById(id: {Entity}Id, {entity}: Partial<I{Entity}>): Promise<I{Entity}> {
    await this.{entity}Model.tx.getRepository({Entity}Entity).update({ uuid: id }, {entity});
    const updated{Entity} = await this.{entity}Model.tx.getRepository({Entity}Entity).findOne({
      where: {
        uuid: id,
      },
    });
    return {Entity}TypeOrmRepository.toDomain(updated{Entity} as {Entity}Entity);
  }

  public static toDomain({entity}Entity: {Entity}Entity): I{Entity} {
    return Builder({Entity})
      .uuid({entity}Entity.uuid as {Entity}Id)
      .name({entity}Entity.name as {Entity}Name)
      .price({entity}Entity.price as {Entity}Price)
      .description({entity}Entity.description as {Entity}Description)
      .image({entity}Entity.image as {Entity}Image)
      .status({entity}Entity.status as Status)
      .createdAt({entity}Entity.createdAt as {Entity}CreatedAt)
      .updatedAt({entity}Entity.updatedAt as {Entity}UpdatedAt)
      .build();
  }
}
```

### Use Case Pattern
```typescript
@Injectable()
export class Delete{Entity}ByIdUseCase {
  constructor(
    @Inject({entity}RepositoryToken)
    private readonly {entity}Repository: {Entity}Repository,
  ) {}

  async execute(id: {Entity}Id): Promise<void> {
    // Business logic
  }
}
```

### Test Pattern
#### testing ruls 1. Arrange 2. Act 3. Assert

```typescript
describe('Delete{Entity}ByIdUseCase', () => {
  let delete{Entity}ByIdUseCase: Delete{Entity}ByIdUseCase;
  const {entity}Repository = mock<{Entity}Repository>();

  beforeEach(() => {
    delete{Entity}ByIdUseCase = new Delete{Entity}ByIdUseCase({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const {entity}Id = faker.string.uuid() as {Entity}Id;
  it('should be throw error when {entity} not found', async () => {
    //Arrange
    {entity}Repository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('{Entity} not found');

    //Act
    const actual = delete{Entity}ByIdUseCase.execute({entity}Id);

    //Assert
    await expect(actual).rejects.toThrow(errorExpected);
    expect({entity}Repository.getById).toHaveBeenCalledWith({entity}Id);
    expect({entity}Repository.deleteById).not.toHaveBeenCalled();
  });

  it('should be delete {entity}', async () => {
    //Arrange
    {entity}Repository.getById.mockResolvedValue(mock<I{Entity}>({ uuid: {entity}Id }));
    {entity}Repository.deleteById.mockResolvedValue(undefined);

    //Act
    const actual = await delete{Entity}ByIdUseCase.execute({entity}Id);
    //Assert
    expect(actual).toBeUndefined();
    expect({entity}Repository.getById).toHaveBeenCalledWith({entity}Id);
    expect({entity}Repository.deleteById).toHaveBeenCalledWith({entity}Id);
  });
});
```

### Controller Pattern
```typescript

@UseGuards(JwtAuthGuard)
@Controller('{entity}s')
export class {Entity}Controller {
  constructor(
    private readonly create{Entity}UseCase: Create{Entity}UseCase,
    private readonly delete{Entity}ByIdUseCase: Delete{Entity}ByIdUseCase,
    private readonly getAll{Entity}sUseCase: GetAll{Entity}sUseCase,
    private readonly update{Entity}ByIdUseCase: Update{Entity}ByIdUseCase,
    private readonly get{Entity}ByIdUseCase: Get{Entity}ByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a {entity}' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {entity} has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  create(@Body() create{Entity}Dto: Create{Entity}Dto): Promise<I{Entity}> {
    const command = Builder<I{Entity}>()
      .name(create{Entity}Dto.name as {Entity}Name)
      .price(create{Entity}Dto.price as {Entity}Price)
      .image(create{Entity}Dto.image as {Entity}Image)
      .description(create{Entity}Dto.description as {Entity}Description)
      .build();
    return this.create{Entity}UseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all {entity}s' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {entity}s have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Get()
  getAll(): Promise<I{Entity}[]> {
    return this.getAll{Entity}sUseCase.execute();
  }

  @ApiOperation({ summary: 'Delete a {entity}' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {entity} has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The {entity} not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @ApiParam({ name: 'id', type: String, description: 'The id of the {entity}' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: {Entity}Id): Promise<void> {
    return this.delete{Entity}ByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a {entity}' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {entity} has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The {entity} not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {entity}' })
  @Transactional()
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: {Entity}Id, @Body() update{Entity}Dto: Update{Entity}Dto): Promise<I{Entity}> {
    const command = Builder<I{Entity}>()
      .name(update{Entity}Dto.name as {Entity}Name)
      .price(update{Entity}Dto.price as {Entity}Price)
      .image(update{Entity}Dto.image as {Entity}Image)
      .description(update{Entity}Dto.description as {Entity}Description)
      .status(update{Entity}Dto.status as Status)
      .build();
    return this.update{Entity}ByIdUseCase.execute(id, command);
  }

  @ApiOperation({ summary: 'Get a {entity} by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {entity} has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {entity}' })
  @Transactional()
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: {Entity}Id): Promise<I{Entity} | undefined> {
    return this.get{Entity}ByIdUseCase.execute(id);
  }
}
```

### Create Dto Pattern

```typescript
export class Create{Entity}Dto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'The name of the {entity} in multiple languages',
  })
  @IsNotEmpty()
  name: {Entity}Name;

  @ApiProperty({
    type: Number,
    example: 100.75,
    description: 'The price of the {entity}',
  })
  @IsNotEmpty()
  price: {Entity}Price;

  @ApiProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
    description: 'The image of the {entity}',
  })
  @IsOptional()
  image?: {Entity}Image;

  @ApiProperty({
    type: String,
    example: 'This is a {entity} description',
    description: 'The description of the {entity}',
  })
  @IsOptional()
  description: {Entity}Description;
}
```

### Update Dto Pattern

```typescript
import { I{Entity} } from 'src/{entity}s/applications/domains/{entity}.domain';

export interface Update{Entity}Dto extends Partial<I{Entity}> {}
```

### Http  Rest Client File Pattern
```bash
### Login
# @name login
POST {{host}}/auth/login
content-type: application/json

{
  "username": "user2",
 "password": "12345678"
}
###

@myAccessToken = {{login.response.body.accessToken}}

### Create {entity}s
POST {{host}}/{entity}s
Content-Type: application/json
authorization: Bearer {{myAccessToken}}

{ 

    "name": "{Entity} new 66",
    "price": 100,
    "image": "https://example.com/avatar.jpg",
    "description": "This is a {entity} description"
}

### Get All {Entity}s
GET {{host}}/{entity}s
authorization: Bearer {{myAccessToken}}

### Get {Entity} By Id
GET {{host}}/{entity}s/5b33cbbe-8294-4083-9a4c-981f6bd08533
authorization: Bearer {{myAccessToken}}

### Delete {Entity} By Id
DELETE {{host}}/{entity}s/5efeac2d-ef72-4ebe-a851-48f0e6b8fca8
authorization: Bearer {{myAccessToken}}

### Update {Entity} By Id
PUT {{host}}/{entity}s/5b33cbbe-8294-4083-9a4c-981f6bd08533
Content-Type: application/json
authorization: Bearer {{myAccessToken}}

{
    "name": "{Entity} new 99 update",
    "price": 1000,
    "image": "https://example.com/avatar.jpg",
    "description": "This is a {entity} description"
}
```

## Project-Specific Notes
- The project uses Thai comments in some places - maintain consistency with existing code style
- CORS is configured for `http://localhost:7000`
- Default password functionality exists (check environment variables)
- Transaction support is available through @nestjs-cls/transactional
- Logging is configured with Pino for structured logging

---

**Remember**: Always maintain the hexagonal architecture principles, write tests, and follow the established patterns when extending this codebase.
