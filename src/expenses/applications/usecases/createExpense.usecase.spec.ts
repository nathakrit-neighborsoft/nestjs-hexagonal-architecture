import { faker } from '@faker-js/faker';
import { Builder } from 'builder-pattern';
import { UserId } from 'src/users/applications/domains/user.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  ExpenseAmount,
  ExpenseCategory,
  ExpenseCreatedAt,
  ExpenseDate,
  ExpenseId,
  ExpenseNotes,
  ExpenseTitle,
  ExpenseUpdatedAt,
  IExpense,
} from '../domains/expense.domain';
import { ExpenseRepository } from '../ports/expense.repository';
import { CreateExpenseUseCase } from './createExpense.usecase';

describe('CreateExpenseUseCase', () => {
  let useCase: CreateExpenseUseCase;
  const expenseRepository = mock<ExpenseRepository>();

  beforeEach(() => {
    useCase = new CreateExpenseUseCase(expenseRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const expenseId = faker.string.uuid() as ExpenseId;
  const userId = faker.string.uuid() as UserId;
  const title = faker.commerce.productName() as ExpenseTitle;
  const amount = faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }) as ExpenseAmount;
  const date = faker.date.recent() as ExpenseDate;
  const category = faker.helpers.arrayElement(['Food', 'Transport', 'Entertainment', 'Shopping']) as ExpenseCategory;
  const notes = faker.lorem.sentence() as ExpenseNotes;

  const expenseData = Builder<IExpense>()
    .uuid(expenseId)
    .title(title)
    .amount(amount)
    .date(date)
    .category(category)
    .notes(notes)
    .userId(userId)
    .createdAt(new Date() as ExpenseCreatedAt)
    .updatedAt(new Date() as ExpenseUpdatedAt)
    .build();

  it('should create expense successfully', async () => {
    // Arrange
    const expectedExpense = expenseData;

    expenseRepository.create.mockResolvedValue(expectedExpense);

    // Act
    const actual = await useCase.execute(expenseData);

    // Assert
    expect(actual).toEqual(expectedExpense);
    expect(expenseRepository.create).toHaveBeenCalledWith(expenseData);
    expect(expenseRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should create expense without optional fields successfully', async () => {
    // Arrange
    const expectedExpense = expenseData;
    expenseRepository.create.mockResolvedValue(expectedExpense);

    // Act
    const actual = await useCase.execute(expenseData);

    // Assert
    expect(actual).toEqual(expectedExpense);
    expect(expenseRepository.create).toHaveBeenCalledWith(expenseData);
    expect(expenseRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when creating expense', async () => {
    // Arrange
    const errorMessage = 'Database connection failed';
    const expectedError = new Error(errorMessage);
    expenseRepository.create.mockRejectedValue(expectedError);

    // Act
    const promise = useCase.execute(expenseData);

    // Assert
    await expect(promise).rejects.toThrow(expectedError);
    expect(expenseRepository.create).toHaveBeenCalledWith(expenseData);
    expect(expenseRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle validation error from repository', async () => {
    // Arrange
    const validationError = new Error('Invalid expense data');
    expenseRepository.create.mockRejectedValue(validationError);

    // Act
    const promise = useCase.execute(expenseData);

    // Assert
    await expect(promise).rejects.toThrow(validationError);
    expect(expenseRepository.create).toHaveBeenCalledWith(expenseData);
    expect(expenseRepository.create).toHaveBeenCalledTimes(1);
  });
});
