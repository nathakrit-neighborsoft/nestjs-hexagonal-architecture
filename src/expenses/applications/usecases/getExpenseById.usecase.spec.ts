import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { UserId } from 'src/users/applications/domains/user.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ExpenseId, IExpense } from '../domains/expense.domain';
import { ExpenseRepository } from '../ports/expense.repository';
import { GetExpenseByIdUseCase } from './getExpenseById.usecase';

describe('GetExpenseByIdUseCase', () => {
  let useCase: GetExpenseByIdUseCase;
  const expenseRepository = mock<ExpenseRepository>();

  beforeEach(() => {
    useCase = new GetExpenseByIdUseCase(expenseRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const expenseId = faker.string.uuid() as ExpenseId;
  const userId = faker.string.uuid() as UserId;
  it('should be throw error when expense not found', async () => {
    //Arrange
    expenseRepository.getByIdAndUserId.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('Expense not found');

    //Act
    const promise = useCase.execute({ id: expenseId, userId });

    //Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect(expenseRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
  });

  it('should be get expense by id', async () => {
    //Arrange
    const expense = mock<IExpense>({ uuid: expenseId });
    expenseRepository.getByIdAndUserId.mockResolvedValue(expense);

    //Act
    const actual = await useCase.execute({ id: expenseId, userId });
    //Assert
    expect(actual).toEqual(expense);
    expect(expenseRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
  });
});
