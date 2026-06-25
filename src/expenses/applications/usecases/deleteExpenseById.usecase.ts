import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UserId } from 'src/types/utility.type';
import type { ExpenseId } from '../domains/expense.domain';
import type { ExpenseRepository } from '../ports/expense.repository';
import { expenseRepositoryToken } from '../ports/expense.repository';

@Injectable()
export class DeleteExpenseByIdUseCase {
  constructor(
    @Inject(expenseRepositoryToken)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<void> {
    const expense = await this.expenseRepository.getByIdAndUserId({ id, userId });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.expenseRepository.deleteByIdAndUserId({ id, userId });
  }
}
