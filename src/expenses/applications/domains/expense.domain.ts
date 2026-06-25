import { Brand, CreatedAt, UpdatedAt } from 'src/types/utility.type';
import { UserId } from 'src/users/applications/domains/user.domain';

export type ExpenseAmount = Brand<number, 'ExpenseAmount'>;
export type ExpenseCategory = Brand<string, 'ExpenseCategory'>;
export type ExpenseCreatedAt = Brand<CreatedAt, 'ExpenseCreatedAt'>;
export type ExpenseDate = Brand<Date, 'ExpenseDate'>;
export type ExpenseId = Brand<string, 'ExpenseId'>;
export type ExpenseNotes = Brand<string, 'ExpenseNotes'>;
export type ExpenseTitle = Brand<string, 'ExpenseTitle'>;
export type ExpenseUpdatedAt = Brand<UpdatedAt, 'ExpenseUpdatedAt'>;

export interface IExpense {
  uuid: ExpenseId;
  title: ExpenseTitle;
  amount: ExpenseAmount;
  date: ExpenseDate;
  category: ExpenseCategory;
  notes?: ExpenseNotes;
  userId: UserId;
  createdAt?: ExpenseCreatedAt;
  updatedAt?: ExpenseUpdatedAt;
}

export class Expense implements IExpense {
  uuid: ExpenseId;
  title: ExpenseTitle;
  amount: ExpenseAmount;
  date: ExpenseDate;
  category: ExpenseCategory;
  notes?: ExpenseNotes;
  userId: UserId;
  createdAt?: ExpenseCreatedAt;
  updatedAt?: ExpenseUpdatedAt;
}
