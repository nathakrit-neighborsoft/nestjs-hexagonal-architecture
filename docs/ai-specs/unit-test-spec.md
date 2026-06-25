# AI Unit Test Specification

This specification provides guidelines for writing comprehensive unit tests for UseCase classes and Domain classes with methods in this NestJS hexagonal architecture project.

## Overview

### Testing Framework & Libraries

- **Test Framework**: Vitest
- **Mocking**: `vitest-mock-extended` for type-safe mocks
- **Test Data**: `@faker-js/faker` for generating test data
- **Object Building**: `builder-pattern` for creating test objects
- **Assertions**: Vitest's built-in `expect` assertions

### Testing Mock
- Mock data use facker data
- Mock repository use vitest-mock-extended

### Construction & Type Rules (for tests)

- Use `builder-pattern` to construct objects; avoid inline object literals for domain/interface instances.
  - Example: `const todo = Builder<ITodo>().id(1).title('todo1').build();`
- Do not use the spread operator `...` when creating test objects or arrays.
- Do not use `any`; prefer precise types or generics. Use `unknown` with type narrowing if necessary.

### Test File Naming Convention

- UseCase tests: `{operation}{Entity}.usecase.spec.ts`
- Domain tests: `{entity}.domain.spec.ts`

## UseCase Unit Test Specification

### 1. Test File Structure Template

```typescript
import { faker } from '@faker-js/faker';
import { {SpecificException} } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
// Import domain types and interfaces
import { {DomainTypes}, I{Entity} } from '../domains/{entity}.domain';
import { {Entity}Repository } from '../ports/{entity}.repository';
import { {Operation}{Entity}UseCase } from './{operation}{Entity}.usecase';

describe('{Operation}{Entity}UseCase', () => {
  let useCase: {Operation}{Entity}UseCase;
  const {entity}Repository = mock<{Entity}Repository>();
  // Mock other dependencies if needed

  beforeEach(() => {
    useCase = new {Operation}{Entity}UseCase({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Test data constants
  const {entity}Id = faker.string.uuid() as {Entity}Id;

  // Test cases go here
});
```

### 2. Test Case Patterns for 100% Coverage

#### A. Happy Path Tests

```typescript
it('should be {successful_action_description}', async () => {

  //Arrange
  const expectedResult = mock<I{Entity}>({ uuid: {entity}Id });
  {entity}Repository.{repositoryMethod}.mockResolvedValue(expectedResult);

  //Act
  const actual = await useCase.execute({ /* command parameters */ });

  //Assert
  expect(actual).toEqual(expectedResult);
  expect({entity}Repository.{repositoryMethod}).toHaveBeenCalledWith(/* expected parameters */);
});
```

#### B. Error Scenarios

```typescript
it('should be throw error when {error_condition}', async () => {

  //Arrange
  const errorExpected = new {SpecificException}('{error_message}');
  {entity}Repository.{repositoryMethod}.mockResolvedValue(undefined); // or appropriate error condition

  //Act
  const promise = useCase.execute({ /* command parameters */ });

  //Assert
  await expect(promise).rejects.toThrow(errorExpected);
  expect({entity}Repository.{repositoryMethod}).toHaveBeenCalledWith(/* expected parameters */);
  expect({entity}Repository.{otherMethod}).not.toHaveBeenCalled(); // Verify other methods aren't called
});
```

#### C. Validation Tests (if applicable)

```typescript
it('should be throw error when {validation_condition}', async () => {

  //Arrange
  const invalidInput = { /* invalid parameters */ };
  const errorExpected = new {ValidationException}('{validation_message}');

  //Act
  const promise = useCase.execute(invalidInput);

  //Assert
  await expect(promise).rejects.toThrow(errorExpected);
  // Verify repository methods are not called when validation fails
  expect({entity}Repository.{method}).not.toHaveBeenCalled();
});
```

### 3. UseCase Testing Scenarios by Type

#### Create Operations

- **Happy Path**: Successfully creates entity
- **Error Cases**: Validation errors, duplicate entity conflicts
- **Edge Cases**: Required field validation, business rule violations

#### Read Operations (Get by ID, Get All)

- **Happy Path**: Successfully retrieves entity/entities
- **Error Cases**: Entity not found, unauthorized access
- **Edge Cases**: Empty results, pagination boundaries

#### Update Operations

- **Happy Path**: Successfully updates entity
- **Error Cases**: Entity not found, validation errors, unauthorized access
- **Edge Cases**: Partial updates, concurrent modification conflicts

#### Delete Operations

- **Happy Path**: Successfully deletes entity
- **Error Cases**: Entity not found, unauthorized access
- **Edge Cases**: Cascade deletion rules, dependency constraints

### 4. Mock Verification Patterns

```typescript
// Verify method was called with exact parameters
expect({entity}Repository.{method}).toHaveBeenCalledWith({
  id: expectedId, 
});

// Verify method was called once
expect({entity}Repository.{method}).toHaveBeenCalledTimes(1);

// Verify method was NOT called
expect({entity}Repository.{method}).not.toHaveBeenCalled();

// Verify call order for multiple repository calls
expect({entity}Repository.getById).toHaveBeenCalledBefore({entity}Repository.updateById);
```

## Domain Unit Test Specification

### 1. Domain Test File Structure

```typescript
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { {Entity}, {EntityType} } from './{entity}.domain';

describe('{Entity}', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('{methodName}', () => {
    it('should be {expected_behavior}', async () => { 

      //Arrange
      const {entity} = Builder({Entity}).build();
      // Setup test data

      //Act
      const result = await {entity}.{methodName}(/* parameters */);

      //Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Unit Test Create
```typescript
import { faker } from '@faker-js/faker';
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  {Entity}Amount,
  {Entity}Category,
  {Entity}CreatedAt,
  {Entity}Date,
  {Entity}Id,
  {Entity}Notes,
  {Entity}Title,
  {Entity}UpdatedAt,
  I{Entity},
} from '../domains/{entity}.domain';
import { {Entity}Repository } from '../ports/{entity}.repository';
import { Create{Entity}UseCase } from './create{Entity}.usecase';

describe('Create{Entity}UseCase', () => {
  let useCase: Create{Entity}UseCase;
  const {entity}Repository = mock<{Entity}Repository>();

  beforeEach(() => {
    useCase = new Create{Entity}UseCase({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const {entity}Id = faker.string.uuid() as {Entity}Id;
  const title = faker.commerce.productName() as {Entity}Title;
  const amount = faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }) as {Entity}Amount;
  const date = faker.date.recent() as {Entity}Date;
  const category = faker.helpers.arrayElement(['Food', 'Transport', 'Entertainment', 'Shopping']) as {Entity}Category;
  const notes = faker.lorem.sentence() as {Entity}Notes;

  const {entity}Data = Builder<I{Entity}>()
    .uuid({entity}Id)
    .title(title)
    .amount(amount)
    .date(date)
    .category(category)
    .notes(notes)
    .createdAt(new Date() as {Entity}CreatedAt)
    .updatedAt(new Date() as {Entity}UpdatedAt)
    .build();

  it('should create {entity} successfully', async () => {
    // Arrange
    const expected{Entity} = {entity}Data;

    {entity}Repository.create.mockResolvedValue(expected{Entity});

    // Act
    const actual = await useCase.execute({entity}Data);

    // Assert
    expect(actual).toEqual(expected{Entity});
    expect({entity}Repository.create).toHaveBeenCalledWith({entity}Data);
    expect({entity}Repository.create).toHaveBeenCalledTimes(1);
  });

  it('should create {entity} without optional fields successfully', async () => {
    // Arrange
    const expected{Entity} = {entity}Data;
    {entity}Repository.create.mockResolvedValue(expected{Entity});

    // Act
    const actual = await useCase.execute({entity}Data);

    // Assert
    expect(actual).toEqual(expected{Entity});
    expect({entity}Repository.create).toHaveBeenCalledWith({entity}Data);
    expect({entity}Repository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when creating {entity}', async () => {
    // Arrange
    const errorMessage = 'Database connection failed';
    const expectedError = new Error(errorMessage);
    {entity}Repository.create.mockRejectedValue(expectedError);

    // Act
    const promise = useCase.execute({entity}Data);

    // Assert
    await expect(promise).rejects.toThrow(expectedError);
    expect({entity}Repository.create).toHaveBeenCalledWith({entity}Data);
    expect({entity}Repository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle validation error from repository', async () => {
    // Arrange
    const validationError = new Error('Invalid {entity} data');
    {entity}Repository.create.mockRejectedValue(validationError);

    // Act
    const promise = useCase.execute({entity}Data);

    // Assert
    await expect(promise).rejects.toThrow(validationError);
    expect({entity}Repository.create).toHaveBeenCalledWith({entity}Data);
    expect({entity}Repository.create).toHaveBeenCalledTimes(1);
  });
});

```

#### Unit Test Delete template
```typescript
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common'; 
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { {Entity}Id, I{Entity} } from '../domains/{entity}.domain';
import { {Entity}Repository } from '../ports/{entity}.repository';
import { {UseCaseClassName} } from './delete{Entity}ById.usecase';

describe('{UseCaseClassName}', () => {
  let useCase: {UseCaseClassName};
  const {entity}Repository = mock<{Entity}Repository>();

  beforeEach(() => {
    useCase = new {UseCaseClassName}({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const {entity}Id = faker.string.uuid() as {Entity}Id; 
  it('should be throw error when {Entity} not found', async () => {
    //Arrange
    const errorExpected = new NotFoundException('{Entity} not found');
    {entity}Repository.getById.mockResolvedValue(undefined);

    //Act
    const promise = useCase.execute({ id: {entity}Id });

    //Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
    expect({entity}Repository.deleteById).not.toHaveBeenCalled();
  });

  it('should be delete {entity}', async () => {
    //Arrange
    {entity}Repository.getById.mockResolvedValue(mock<I{Entity}>({ uuid: {entity}Id }));
    {entity}Repository.deleteById.mockResolvedValue(undefined);

    //Act
    const actual = await useCase.execute({ id: {entity}Id });
    //Assert
    expect(actual).toBeUndefined();
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
    expect({entity}Repository.deleteById).toHaveBeenCalledWith({ id: {entity}Id });
  });
});

```

### unit test getById  template
```typescript
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common'; 
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { {Entity}Id, I{Entity} } from '../domains/{entity}.domain';
import { {Entity}Repository } from '../ports/{entity}.repository';
import { Get{Entity}ByIdUseCase } from './get{Entity}ById.usecase';

describe('Get{Entity}ByIdUseCase', () => {
  let useCase: Get{Entity}ByIdUseCase;
  const {entity}Repository = mock<{Entity}Repository>();

  beforeEach(() => {
    useCase = new Get{Entity}ByIdUseCase({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const {entity}Id = faker.string.uuid() as {entity}Id; 
  it('should be throw error when {entity} not found', async () => {
    //Arrange
    {entity}Repository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('{Entity} not found');

    //Act
    const promise = useCase.execute({ id: {entity}Id });

    //Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
  });

  it('should be get {entity} by id', async () => {
    //Arrange
    const {entity} = mock<I{Entity}>({ uuid: {entity}Id });
    {entity}Repository.getById.mockResolvedValue({entity});

    //Act
    const actual = await useCase.execute({ id: {entity}Id });
    //Assert
    expect(actual).toEqual({entity});
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
  });
});

```

### unit test updateById  template
```typescript
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { {Entity}Id, I{Entity} } from '../domains/{entity}.domain';
import { {Entity}Repository } from '../ports/{entity}.repository';
import { Update{Entity}ByIdUseCase } from './update{Entity}ById.usecase';

describe('Update{Entity}ByIdUseCase ', () => {
  let useCase: Update{Entity}ByIdUseCase ;
  const {entity}Repository = mock<{Entity}Repository>();

  beforeEach(() => {
    useCase = new Update{Entity}ByIdUseCase ({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const {entity}Id = faker.string.uuid() as {Entity}Id;
  it('should be throw error when {entity} not found', async () => {
    //Arrange
    const command = mock<I{Entity}>({ uuid: {entity}Id });
    const errorExpected = new NotFoundException('{Entity} not found');
    {entity}Repository.getById.mockResolvedValue(undefined);

    //Act
    const promise = useCase.execute(command);

    //Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
    expect({entity}Repository.updateById).not.toHaveBeenCalled();
  });

  it('should be update {entity}', async () => {
    //Arrange
    const {entity} = mock<I{Entity}>({ uuid: {entity}Id });
    const title = faker.commerce.productName() as ExpenseTitle
    const command = Builder<I{Entity}>().uuid({entity}Id).title(title).build();
    {entity}Repository.getById.mockResolvedValue({entity});
    {entity}Repository.updateById.mockResolvedValue({entity});

    //Act
    const actual = await useCase.execute(command);

    //Assert
    expect(actual).toEqual({entity});
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
    expect({entity}Repository.updateById).toHaveBeenCalledWith(command);
  });
});


```


### 2. Domain Test Patterns

#### Business Logic Methods

```typescript
describe('{businessMethod}', () => {
  it('should be {success_case_description}', async () => { 

    //Arrange
    const {entity} = Builder({Entity}).{property}(validValue).build();
    const input = /* test input */;

    //Act
    const result = await {entity}.{businessMethod}(input);

    //Assert
    expect(result).toBe(expectedResult);
  });

  it('should be {failure_case_description}', async () => { 

    //Arrange
    const {entity} = Builder({Entity}).{property}(invalidValue).build();
    const input = /* invalid input */;

    //Act & Assert
    expect(() => {entity}.{businessMethod}(input)).toThrow(/* expected error */);
  });
});
```

#### Validation Methods

```typescript
describe('{validationMethod}', () => {
  it('should return true for valid {condition}', () => { 

    //Arrange
    const {entity} = Builder({Entity}).{property}(validValue).build();

    //Act
    const isValid = {entity}.{validationMethod}();

    //Assert
    expect(isValid).toBe(true);
  });

  it('should return false for invalid {condition}', () => { 

    //Arrange
    const {entity} = Builder({Entity}).{property}(invalidValue).build();

    //Act
    const isValid = {entity}.{validationMethod}();

    //Assert
    expect(isValid).toBe(false);
  });
});
```

### 3. Domain Testing Guidelines

#### When to Test Domain Classes

- ✅ **Test**: Classes with business logic methods (validation, calculation, transformation)
- ✅ **Test**: Methods that modify state or perform operations
- ✅ **Test**: Complex getters with logic
- ❌ **Skip**: Simple data containers with only properties
- ❌ **Skip**: Interfaces without implementation

#### Domain Test Coverage

- **Business Rules**: Test all business logic paths
- **State Changes**: Verify state modifications work correctly
- **Validation Logic**: Test all validation scenarios
- **Edge Cases**: Boundary conditions, null/undefined handling
- **Error Handling**: Domain-specific exceptions

## Test Data Generation Patterns

### Using Faker.js

```typescript
// Basic data types
const id = faker.string.uuid() as {Entity}Id;
const email = faker.internet.email() as UserEmail;
const name = faker.person.fullName() as UserName;
const amount = faker.number.float({ min: 0.01, max: 9999.99 }) as {Entity}Amount;
const date = faker.date.recent() as {Entity}Date;

// Complex objects with Builder pattern
const {entity} = Builder<I{Entity}>()
  .uuid(id)
  .{property}(faker.{category}.{method}() as {Type})
  .build();

// Mock objects with specific properties
const mock{Entity} = mock<I{Entity}>({
  uuid: {entity}Id,
  {property}: expectedValue
});
```

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names: `should be {action} when {condition}`
- Follow AAA pattern: Arrange, Act, Assert
- Keep tests focused on single behavior

### 2. Mock Management

- Reset all mocks in `afterEach`
- Use type-safe mocks with `vitest-mock-extended`
- Mock only external dependencies
- Verify mock interactions explicitly

### 3. Assertions

- Test both positive and negative scenarios
- Verify return values AND side effects
- Use specific matchers (`toBe`, `toEqual`, `toThrow`)
- Assert on mock call parameters

### 4. Error Testing

- Test all error conditions
- Use specific exception types
- Verify error messages when important for user experience
- Ensure proper error propagation

### 5. Coverage Goals

- **UseCases**: 100% line and branch coverage
- **Domains**: 100% coverage for classes with methods
- **Edge Cases**: Test boundary conditions
- **Error Paths**: All error scenarios covered

## Example Complete Test Implementation

### UseCase Test Example

```typescript
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { {Entity}Id, I{Entity} } from '../domains/{entity}.domain';
import { {Entity}Repository } from '../ports/{entity}.repository';
import { Get{Entity}ByIdUseCase } from './get{Entity}ById.usecase';

describe('Get{Entity}ByIdUseCase', () => {
  let useCase: Get{Entity}ByIdUseCase;
  const {entity}Repository = mock<{Entity}Repository>();

  beforeEach(() => {
    useCase = new Get{Entity}ByIdUseCase({entity}Repository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const {entity}Id = faker.string.uuid() as {entity}Id;

  it('should be throw error when {entity} not found', async () => {
    // Arrange
    {entity}Repository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('{Entity} not found');

    // Act
    const promise = useCase.execute({ id: {entity}Id });

    // Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id  });
  });

  it('should be get {entity} by id', async () => {
    // Arrange
    const {entity} = mock<I{Entity}>({ uuid: {entity}Id });
    {entity}Repository.getById.mockResolvedValue({entity});

    // Act
    const actual = await useCase.execute({ id: {entity}Id });

    // Assert
    expect(actual).toEqual({entity});
    expect({entity}Repository.getById).toHaveBeenCalledWith({ id: {entity}Id });
  });
});
```

### Domain Test Example

```typescript
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { User, UserPassword } from './user.domain';

describe('User', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      // Arrange
      const password = 'testPassword123' as UserPassword;
      const user = Builder(User).build();
      await user.setHashPassword(password);

      // Act
      const isMatch = await user.comparePassword(password);

      // Assert
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      // Arrange
      const password = 'testPassword123' as UserPassword;
      const wrongPassword = 'wrongPassword456' as UserPassword;
      const user = Builder(User).build();
      await user.setHashPassword(password);

      // Act
      const isMatch = await user.comparePassword(wrongPassword);

      // Assert
      expect(isMatch).toBe(false);
    });
  });

  describe('hiddenPassword', () => {
    it('should be hidden password', () => {
      // Arrange
      const password = 'testPassword123' as UserPassword;
      const user = Builder(User).password(password).build();
      const expected = '' as UserPassword;

      // Act
      user.hiddenPassword();

      // Assert
      expect(user.password).toBe(expected);
      expect(user.password).not.toBe(password);
    });
  });
});
```

## Commands for Running Tests

```bash
# Run specific test file
pnpm test {testFileName}

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch

# View coverage report
open coverage/index.html
```

## Summary

This specification ensures:

- **100% coverage** for all UseCase classes
- **Complete coverage** for Domain classes with methods
- **Consistent patterns** across all test files
- **Type safety** with proper TypeScript usage
- **Maintainable tests** with clear structure and naming
- **Comprehensive error testing** for all failure scenarios
- **Mock verification** to ensure proper dependency interaction
