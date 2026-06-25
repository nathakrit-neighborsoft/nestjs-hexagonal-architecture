import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import type { UserId } from 'src/types/utility.type';
import { expenses } from 'src/databases/schemas';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/databases/schemas';
import type { SQL } from 'drizzle-orm';
import {
  Expense,
  ExpenseAmount,
  ExpenseCategory,
  ExpenseCreatedAt,
  ExpenseDate,
  ExpenseId,
  ExpenseNotes,
  ExpenseTitle,
  ExpenseUpdatedAt,
  IExpense,
} from '../../applications/domains/expense.domain';
import {
  ExpenseReportReturnType,
  ExpenseRepository,
  ExpensesByCategory,
  GetAllExpensesQuery,
  GetAllExpensesReturnType,
  GetExpenseReportQuery,
} from '../../applications/ports/expense.repository';

type DrizzleDB = NodePgDatabase<typeof schema>;

@Injectable()
export class ExpenseDrizzleRepository implements ExpenseRepository {
  constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm<DrizzleDB>>) {}

  async create(expense: IExpense): Promise<IExpense> {
    const [result] = await this.model.tx
      .insert(expenses)
      .values({
        title: expense.title,
        amount: expense.amount.toString(),
        date: expense.date.toISOString().split('T')[0],
        category: expense.category,
        notes: expense.notes,
        userId: expense.userId,
      })
      .returning();
    return ExpenseDrizzleRepository.toDomain(result);
  }

  async deleteByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<void> {
    await this.model.tx
      .delete(expenses)
      .where(and(eq(expenses.uuid, id), eq(expenses.userId, userId)));
  }

  async getAll(params: GetAllExpensesQuery): Promise<GetAllExpensesReturnType> {
    const { search, sort, order, page, limit, userId, category, startDate, endDate } = params;
    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const conditions: (SQL | undefined)[] = [eq(expenses.userId, userId)];

    if (search) {
      conditions.push(
        or(ilike(expenses.title, `%${search}%`), ilike(expenses.notes, `%${search}%`))!,
      );
    }
    if (category) conditions.push(eq(expenses.category, category));
    if (startDate) conditions.push(gte(expenses.date, startDate.toISOString().split('T')[0]));
    if (endDate) conditions.push(lte(expenses.date, endDate.toISOString().split('T')[0]));

    const where = and(...conditions.filter(Boolean) as SQL[]);

    const [{ count: total }] = await this.model.tx
      .select({ count: count() })
      .from(expenses)
      .where(where!);

    const orderByClause =
      sort && ['title', 'amount', 'date', 'category', 'createdAt'].includes(sort)
        ? order === 'ASC'
          ? asc((expenses as any)[sort])
          : desc((expenses as any)[sort])
        : desc(expenses.date);

    const effectiveLimit = currentLimit === -1 ? 999999 : currentLimit;
    const effectiveOffset = currentLimit === -1 ? 0 : (currentPage - 1) * currentLimit;
    const rows = await this.model.tx
      .select()
      .from(expenses)
      .where(where!)
      .orderBy(orderByClause)
      .limit(effectiveLimit)
      .offset(effectiveOffset);

    const result = rows.map(ExpenseDrizzleRepository.toDomain);
    const totalPages = currentLimit === -1 ? 1 : Math.ceil(Number(total) / currentLimit);

    return StrictBuilder<GetAllExpensesReturnType>()
      .result(result)
      .meta(
        StrictBuilder<GetAllMetaType>()
          .page(currentPage)
          .limit(currentLimit)
          .total(Number(total))
          .totalPages(totalPages)
          .build(),
      )
      .build();
  }

  async getByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<IExpense | undefined> {
    const [result] = await this.model.tx
      .select()
      .from(expenses)
      .where(and(eq(expenses.uuid, id), eq(expenses.userId, userId)))
      .limit(1);
    return result ? ExpenseDrizzleRepository.toDomain(result) : undefined;
  }

  async updateByIdAndUserId(expense: IExpense): Promise<IExpense> {
    const [result] = await this.model.tx
      .update(expenses)
      .set({
        title: expense.title,
        amount: expense.amount.toString(),
        date: expense.date.toISOString().split('T')[0],
        category: expense.category,
        notes: expense.notes,
      })
      .where(and(eq(expenses.uuid, expense.uuid), eq(expenses.userId, expense.userId)))
      .returning();
    return ExpenseDrizzleRepository.toDomain(result);
  }

  async getExpenseReport(query: GetExpenseReportQuery): Promise<ExpenseReportReturnType> {
    const { userId, startDate, endDate } = query;

    const conditions: (SQL | undefined)[] = [eq(expenses.userId, userId)];
    if (startDate) conditions.push(gte(expenses.date, startDate.toISOString().split('T')[0]));
    if (endDate) conditions.push(lte(expenses.date, endDate.toISOString().split('T')[0]));
    const whereData = and(...conditions.filter(Boolean) as SQL[]);

    const [totalResult] = await this.model.tx
      .select({
        totalAmount: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
        totalExpenses: sql<string>`COALESCE(COUNT(${expenses.uuid}), 0)`,
      })
      .from(expenses)
      .where(whereData);

    const categoryResults = await this.model.tx
      .select({
        category: expenses.category,
        total: sql<string>`SUM(${expenses.amount})`,
        count: sql<string>`COUNT(${expenses.uuid})`,
      })
      .from(expenses)
      .where(whereData)
      .groupBy(expenses.category)
      .orderBy(desc(sql`SUM(${expenses.amount})`));

    const categories: ExpensesByCategory[] = categoryResults.map((row) => ({
      category: row.category,
      total: Number(row.total) || 0,
      count: Number(row.count) || 0,
    }));

    return {
      totalAmount: Number(totalResult?.totalAmount) || 0,
      totalExpenses: Number(totalResult?.totalExpenses) || 0,
      categories,
      dateRange: { startDate, endDate },
    };
  }

  static toDomain(row: typeof expenses.$inferSelect): IExpense {
    const amount = Number(row.amount) as ExpenseAmount;
    return Builder(Expense)
      .uuid(row.uuid as ExpenseId)
      .title(row.title as ExpenseTitle)
      .amount(amount)
      .date(row.date as unknown as ExpenseDate)
      .category(row.category as ExpenseCategory)
      .notes(row.notes as ExpenseNotes | undefined)
      .userId(row.userId as UserId)
      .createdAt(row.createdAt as ExpenseCreatedAt)
      .updatedAt(row.updatedAt as ExpenseUpdatedAt)
      .build();
  }
}
