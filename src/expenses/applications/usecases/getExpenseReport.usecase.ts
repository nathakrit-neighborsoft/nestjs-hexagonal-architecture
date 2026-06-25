import { Inject, Injectable } from '@nestjs/common';
import type { ExpenseReportReturnType, ExpenseRepository, GetExpenseReportQuery } from '../ports/expense.repository';
import { expenseRepositoryToken } from '../ports/expense.repository';

@Injectable()
export class GetExpenseReportUseCase {
  constructor(
    @Inject(expenseRepositoryToken)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(query: GetExpenseReportQuery): Promise<ExpenseReportReturnType> {
    return this.expenseRepository.getExpenseReport(query);
  }
}
