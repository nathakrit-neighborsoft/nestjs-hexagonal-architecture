import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { UserId } from 'src/users/applications/domains/user.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ExpenseId, IExpense } from '../domains/expense.domain';
import { ExpenseRepository } from '../ports/expense.repository';
import { UpdateExpenseByIdUseCase } from './updateExpenseById.usecase';

describe('UpdateExpenseByIdUseCase', () => {
  let useCase: UpdateExpenseByIdUseCase;
  const expenseRepository = mock<ExpenseRepository>();

  beforeEach(() => {
    useCase = new UpdateExpenseByIdUseCase(expenseRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const expenseId = faker.string.uuid() as ExpenseId;
  const userId = faker.string.uuid() as UserId;
  it('should be throw error when expense not found', async () => {
    //Arrange
    const command = mock<IExpense>({ uuid: expenseId, userId });
    const errorExpected = new NotFoundException('Expense not found');
    expenseRepository.getByIdAndUserId.mockResolvedValue(undefined);

    //Act
    const promise = useCase.execute(command);

    //Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect(expenseRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
    expect(expenseRepository.updateByIdAndUserId).not.toHaveBeenCalled();
  });

  it('should be update expense', async () => {
    //Arrange
    const expense = mock<IExpense>({ uuid: expenseId, userId });
    const command = Builder<IExpense>().uuid(expenseId).userId(userId).build();
    expenseRepository.getByIdAndUserId.mockResolvedValue(expense);
    expenseRepository.updateByIdAndUserId.mockResolvedValue(expense);

    //Act
    const actual = await useCase.execute(command);

    //Assert
    expect(actual).toEqual(expense);
    expect(expenseRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
    expect(expenseRepository.updateByIdAndUserId).toHaveBeenCalledWith(command);
  });
});
