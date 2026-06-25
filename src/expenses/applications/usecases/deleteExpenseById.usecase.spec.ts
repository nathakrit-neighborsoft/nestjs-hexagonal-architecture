import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { UserId } from 'src/users/applications/domains/user.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ExpenseId, IExpense } from '../domains/expense.domain';
import { ExpenseRepository } from '../ports/expense.repository';
import { DeleteExpenseByIdUseCase } from './deleteExpenseById.usecase';

describe('DeleteExpenseByIdUseCase', () => {
  let useCase: DeleteExpenseByIdUseCase;
  const expenseRepository = mock<ExpenseRepository>();

  beforeEach(() => {
    useCase = new DeleteExpenseByIdUseCase(expenseRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const expenseId = faker.string.uuid() as ExpenseId;
  const userId = faker.string.uuid() as UserId;
  it('should be throw error when expense not found', async () => {
    //Arrange
    const errorExpected = new NotFoundException('Expense not found');
    expenseRepository.getByIdAndUserId.mockResolvedValue(undefined);

    //Act
    const promise = useCase.execute({ id: expenseId, userId });

    //Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect(expenseRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
    expect(expenseRepository.deleteByIdAndUserId).not.toHaveBeenCalled();
  });

  it('should be delete expense', async () => {
    //Arrange
    expenseRepository.getByIdAndUserId.mockResolvedValue(mock<IExpense>({ uuid: expenseId }));
    expenseRepository.deleteByIdAndUserId.mockResolvedValue(undefined);

    //Act
    const actual = await useCase.execute({ id: expenseId, userId });
    //Assert
    expect(actual).toBeUndefined();
    expect(expenseRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
    expect(expenseRepository.deleteByIdAndUserId).toHaveBeenCalledWith({ id: expenseId, userId });
  });
});
