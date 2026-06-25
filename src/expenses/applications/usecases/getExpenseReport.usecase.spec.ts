import { faker } from '@faker-js/faker';
import { StrictBuilder } from 'builder-pattern';
import { UserId } from 'src/users/applications/domains/user.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  ExpenseReportReturnType,
  ExpenseRepository,
  ExpensesByCategory,
  GetExpenseReportQuery,
} from '../ports/expense.repository';
import { GetExpenseReportUseCase } from './getExpenseReport.usecase';

describe('GetExpenseReportUseCase', () => {
  let useCase: GetExpenseReportUseCase;
  const expenseRepository = mock<ExpenseRepository>();

  beforeEach(() => {
    useCase = new GetExpenseReportUseCase(expenseRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const userId = faker.string.uuid() as UserId;
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  const mockCategories: ExpensesByCategory[] = [
    { category: 'Food', total: 250.5, count: 15 },
    { category: 'Transport', total: 180.0, count: 8 },
    { category: 'Entertainment', total: 120.75, count: 5 },
    { category: 'Shopping', total: 300.25, count: 12 },
  ];

  const mockReport = StrictBuilder<ExpenseReportReturnType>()
    .totalAmount(851.5)
    .totalExpenses(40)
    .categories(mockCategories)
    .dateRange({ startDate, endDate })
    .build();

  it('should get expense report successfully with date range', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).startDate(startDate).endDate(endDate).build();

    expenseRepository.getExpenseReport.mockResolvedValue(mockReport);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(mockReport);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should get expense report successfully without date range', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).build();

    const reportWithoutDateRange = StrictBuilder<ExpenseReportReturnType>()
      .totalAmount(851.5)
      .totalExpenses(40)
      .categories(mockCategories)
      .dateRange({})
      .build();

    expenseRepository.getExpenseReport.mockResolvedValue(reportWithoutDateRange);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(reportWithoutDateRange);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should get expense report with only start date', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).startDate(startDate).build();

    const reportWithStartDate = StrictBuilder<ExpenseReportReturnType>()
      .totalAmount(851.5)
      .totalExpenses(40)
      .categories(mockCategories)
      .dateRange({ startDate })
      .build();

    expenseRepository.getExpenseReport.mockResolvedValue(reportWithStartDate);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(reportWithStartDate);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should get expense report with only end date', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).endDate(endDate).build();

    const reportWithEndDate = StrictBuilder<ExpenseReportReturnType>()
      .totalAmount(851.5)
      .totalExpenses(40)
      .categories(mockCategories)
      .dateRange({ endDate })
      .build();

    expenseRepository.getExpenseReport.mockResolvedValue(reportWithEndDate);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(reportWithEndDate);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should return empty report when no expenses found', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).startDate(startDate).endDate(endDate).build();

    const emptyReport = StrictBuilder<ExpenseReportReturnType>()
      .totalAmount(0)
      .totalExpenses(0)
      .categories([])
      .dateRange({ startDate, endDate })
      .build();

    expenseRepository.getExpenseReport.mockResolvedValue(emptyReport);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(emptyReport);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should get expense report with single category', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).startDate(startDate).endDate(endDate).build();

    const singleCategoryReport = StrictBuilder<ExpenseReportReturnType>()
      .totalAmount(250.5)
      .totalExpenses(15)
      .categories([{ category: 'Food', total: 250.5, count: 15 }])
      .dateRange({ startDate, endDate })
      .build();

    expenseRepository.getExpenseReport.mockResolvedValue(singleCategoryReport);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(singleCategoryReport);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when getting expense report', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).startDate(startDate).endDate(endDate).build();

    const errorMessage = 'Database connection failed';
    const expectedError = new Error(errorMessage);
    expenseRepository.getExpenseReport.mockRejectedValue(expectedError);

    // Act
    const promise = useCase.execute(query);

    // Assert
    await expect(promise).rejects.toThrow(expectedError);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });

  it('should handle validation error from repository', async () => {
    // Arrange
    const query = StrictBuilder<GetExpenseReportQuery>().userId(userId).startDate(startDate).endDate(endDate).build();

    const validationError = new Error('Invalid date range');
    expenseRepository.getExpenseReport.mockRejectedValue(validationError);

    // Act
    const promise = useCase.execute(query);

    // Assert
    await expect(promise).rejects.toThrow(validationError);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledWith(query);
    expect(expenseRepository.getExpenseReport).toHaveBeenCalledTimes(1);
  });
});
