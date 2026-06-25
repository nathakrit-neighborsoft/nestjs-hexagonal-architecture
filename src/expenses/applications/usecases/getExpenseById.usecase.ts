import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UserId } from 'src/users/applications/domains/user.domain';
import type { ExpenseId, IExpense } from '../domains/expense.domain';
import type { ExpenseRepository } from '../ports/expense.repository';
import { expenseRepositoryToken } from '../ports/expense.repository';

@Injectable()
export class GetExpenseByIdUseCase {
  constructor(
    @Inject(expenseRepositoryToken)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<IExpense> {
    const expense = await this.expenseRepository.getByIdAndUserId({ id, userId });
    if (!expense) throw new NotFoundException('Expense not found');

    return expense;
  }
}
