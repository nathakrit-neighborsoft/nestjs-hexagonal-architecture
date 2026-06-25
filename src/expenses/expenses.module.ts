import { Module } from '@nestjs/common';
import { ExpenseController } from './adapters/inbounds/expense.controller';
import { ExpenseDrizzleRepository } from './adapters/outbounds/expense.drizzle.repository';
import { expenseRepositoryToken } from './applications/ports/expense.repository';
import { CreateExpenseUseCase } from './applications/usecases/createExpense.usecase';
import { DeleteExpenseByIdUseCase } from './applications/usecases/deleteExpenseById.usecase';
import { GetAllExpensesUseCase } from './applications/usecases/getAllExpenses.usecase';
import { GetExpenseByIdUseCase } from './applications/usecases/getExpenseById.usecase';
import { GetExpenseReportUseCase } from './applications/usecases/getExpenseReport.usecase';
import { UpdateExpenseByIdUseCase } from './applications/usecases/updateExpenseById.usecase';

@Module({
  controllers: [ExpenseController],
  providers: [
    {
      provide: expenseRepositoryToken,
      useClass: ExpenseDrizzleRepository,
    },
    CreateExpenseUseCase,
    DeleteExpenseByIdUseCase,
    GetAllExpensesUseCase,
    GetExpenseByIdUseCase,
    GetExpenseReportUseCase,
    UpdateExpenseByIdUseCase,
  ],
})
export class ExpensesModule {}
