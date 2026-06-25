import { Inject, Injectable } from '@nestjs/common';
import type { ExpenseRepository, GetAllExpensesQuery, GetAllExpensesReturnType } from '../ports/expense.repository';
import { expenseRepositoryToken } from '../ports/expense.repository';

@Injectable()
export class GetAllExpensesUseCase {
  constructor(
    @Inject(expenseRepositoryToken)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(query: GetAllExpensesQuery): Promise<GetAllExpensesReturnType> {
    return this.expenseRepository.getAll(query);
  }
}
