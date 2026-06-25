import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { UserId } from 'src/users/applications/domains/user.domain';
import { ExpenseId, IExpense } from '../domains/expense.domain';

export type UpdateExpenseCommand = Partial<Omit<IExpense, 'uuid' | 'userId' | 'createdAt' | 'updatedAt'>>;

export interface GetAllExpensesQuery extends GetAllParamsType {
  userId: UserId;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface GetAllExpensesReturnType {
  result: IExpense[];
  meta: GetAllMetaType;
}

export interface ExpensesByCategory {
  category: string;
  total: number;
  count: number;
}

export interface GetExpenseReportQuery {
  userId: UserId;
  startDate?: Date;
  endDate?: Date;
}

export interface ExpenseReportReturnType {
  totalAmount: number;
  totalExpenses: number;
  categories: ExpensesByCategory[];
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
}

const expenseRepositoryTokenSymbol: unique symbol = Symbol('ExpenseRepository');
export const expenseRepositoryToken = expenseRepositoryTokenSymbol.toString();

export interface ExpenseRepository {
  create(expense: IExpense): Promise<IExpense>;
  deleteByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<void>;
  getAll(params: GetAllExpensesQuery): Promise<GetAllExpensesReturnType>;
  getByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<IExpense | undefined>;
  getExpenseReport(query: GetExpenseReportQuery): Promise<ExpenseReportReturnType>;
  updateByIdAndUserId(expense: IExpense): Promise<IExpense>;
}
