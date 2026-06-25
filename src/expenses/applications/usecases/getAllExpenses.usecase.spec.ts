import { faker } from '@faker-js/faker';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import { UserId } from 'src/users/applications/domains/user.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  ExpenseAmount,
  ExpenseCategory,
  ExpenseDate,
  ExpenseId,
  ExpenseTitle,
  IExpense,
} from '../domains/expense.domain';
import { ExpenseRepository, GetAllExpensesQuery, GetAllExpensesReturnType } from '../ports/expense.repository';
import { GetAllExpensesUseCase } from './getAllExpenses.usecase';

describe('GetAllExpensesUseCase', () => {
  let useCase: GetAllExpensesUseCase;
  const expenseRepository = mock<ExpenseRepository>();

  beforeEach(() => {
    useCase = new GetAllExpensesUseCase(expenseRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const userId = faker.string.uuid() as UserId;
  const expenseId1 = faker.string.uuid() as ExpenseId;
  const expenseId2 = faker.string.uuid() as ExpenseId;

  const mockExpense1 = Builder<IExpense>()
    .uuid(expenseId1)
    .title(faker.commerce.productName() as ExpenseTitle)
    .amount(faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }) as ExpenseAmount)
    .date(faker.date.recent() as ExpenseDate)
    .category('Food' as ExpenseCategory)
    .userId(userId)
    .build();

  const mockExpense2 = Builder<IExpense>()
    .uuid(expenseId2)
    .title(faker.commerce.productName() as ExpenseTitle)
    .amount(faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }) as ExpenseAmount)
    .date(faker.date.recent() as ExpenseDate)
    .category('Transport' as ExpenseCategory)
    .userId(userId)
    .build();

  const mockMeta = StrictBuilder<GetAllMetaType>().total(2).page(1).limit(10).totalPages(1).build();

  it('should get all expenses successfully with basic query', async () => {
    // Arrange
    const query = StrictBuilder<GetAllExpensesQuery>().userId(userId).page(1).limit(10).build();
    const expectedResult = StrictBuilder<GetAllExpensesReturnType>().result([mockExpense1]).meta(mockMeta).build();

    expenseRepository.getAll.mockResolvedValue(expectedResult);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expectedResult);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should get all expenses with category filter', async () => {
    // Arrange
    const query = StrictBuilder<GetAllExpensesQuery>().userId(userId).category('Food').page(1).limit(10).build();

    const expectedResult = StrictBuilder<GetAllExpensesReturnType>().result([mockExpense1]).meta(mockMeta).build();

    expenseRepository.getAll.mockResolvedValue(expectedResult);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expectedResult);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should get all expenses with date range filter', async () => {
    // Arrange
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    const query = StrictBuilder<GetAllExpensesQuery>()
      .userId(userId)
      .startDate(startDate)
      .endDate(endDate)
      .page(1)
      .limit(10)
      .build();

    const expectedResult: GetAllExpensesReturnType = StrictBuilder<GetAllExpensesReturnType>()
      .result([mockExpense1, mockExpense2])
      .meta(mockMeta)
      .build();

    expenseRepository.getAll.mockResolvedValue(expectedResult);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expectedResult);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should get all expenses with search and sort parameters', async () => {
    // Arrange
    const query = StrictBuilder<GetAllExpensesQuery>()
      .userId(userId)
      .search('groceries')
      .sort('amount')
      .order('desc')
      .page(2)
      .limit(5)
      .build();

    const expectedResult: GetAllExpensesReturnType = StrictBuilder<GetAllExpensesReturnType>()
      .result([mockExpense1])
      .meta({ ...mockMeta, page: 2, limit: 5, total: 1, totalPages: 1 })
      .build();

    expenseRepository.getAll.mockResolvedValue(expectedResult);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expectedResult);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty result when no expenses found', async () => {
    // Arrange
    const query = StrictBuilder<GetAllExpensesQuery>().userId(userId).page(1).limit(10).build();

    const expectedResult = StrictBuilder<GetAllExpensesReturnType>()
      .result([])
      .meta({ ...mockMeta, total: 0, totalPages: 0 })
      .build();

    expenseRepository.getAll.mockResolvedValue(expectedResult);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expectedResult);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when getting expenses', async () => {
    // Arrange
    const query = StrictBuilder<GetAllExpensesQuery>().userId(userId).page(1).limit(10).build();

    const errorMessage = 'Database connection failed';
    const expectedError = new Error(errorMessage);
    expenseRepository.getAll.mockRejectedValue(expectedError);

    // Act
    const promise = useCase.execute(query);

    // Assert
    await expect(promise).rejects.toThrow(expectedError);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle validation error from repository', async () => {
    // Arrange
    const query = StrictBuilder<GetAllExpensesQuery>().userId(userId).page(1).limit(10).build();

    const validationError = new Error('Invalid query parameters');
    expenseRepository.getAll.mockRejectedValue(validationError);

    // Act
    const promise = useCase.execute(query);

    // Assert
    await expect(promise).rejects.toThrow(validationError);
    expect(expenseRepository.getAll).toHaveBeenCalledWith(query);
    expect(expenseRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
