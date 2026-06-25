import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type IExpense } from '../domains/expense.domain';
import type { ExpenseRepository } from '../ports/expense.repository';
import { expenseRepositoryToken } from '../ports/expense.repository';

@Injectable()
export class UpdateExpenseByIdUseCase {
  constructor(
    @Inject(expenseRepositoryToken)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(expense: IExpense): Promise<IExpense> {
    const existingExpense = await this.expenseRepository.getByIdAndUserId({ id: expense.uuid, userId: expense.userId });
    if (!existingExpense) throw new NotFoundException('Expense not found');

    return this.expenseRepository.updateByIdAndUserId(expense);
  }
}
