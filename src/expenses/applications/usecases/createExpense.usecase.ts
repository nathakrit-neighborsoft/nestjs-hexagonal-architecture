import { Inject, Injectable } from '@nestjs/common';
import { type IExpense } from '../domains/expense.domain';
import type { ExpenseRepository } from '../ports/expense.repository';
import { expenseRepositoryToken } from '../ports/expense.repository';

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @Inject(expenseRepositoryToken)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(expense: IExpense): Promise<IExpense> {
    return this.expenseRepository.create(expense);
  }
}
