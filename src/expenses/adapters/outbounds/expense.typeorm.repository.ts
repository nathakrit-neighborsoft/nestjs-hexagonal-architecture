import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import { UserId } from 'src/users/applications/domains/user.domain';
import { Expense, ExpenseAmount, ExpenseId, IExpense } from '../../applications/domains/expense.domain';
import {
  ExpenseReportReturnType,
  ExpenseRepository,
  ExpensesByCategory,
  GetAllExpensesQuery,
  GetAllExpensesReturnType,
  GetExpenseReportQuery,
} from '../../applications/ports/expense.repository';
import { ExpenseEntity } from './expense.entity';

@Injectable()
export class ExpenseTypeOrmRepository implements ExpenseRepository {
  constructor(private readonly expenseModel: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create(expense: IExpense): Promise<IExpense> {
    const expenseEntity = Builder<ExpenseEntity>()
      .title(expense.title)
      .amount(expense.amount)
      .date(expense.date)
      .category(expense.category)
      .notes(expense.notes)
      .userId(expense.userId)
      .build();

    const resultCreated = await this.expenseModel.tx.getRepository(ExpenseEntity).save(expenseEntity);
    return ExpenseTypeOrmRepository.toDomain(resultCreated as ExpenseEntity);
  }

  async deleteByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<void> {
    await this.expenseModel.tx.getRepository(ExpenseEntity).delete({
      uuid: id,
      userId: userId,
    });
  }

  async getAll(params: GetAllExpensesQuery): Promise<GetAllExpensesReturnType> {
    const { search, sort, order, page, limit, userId, category, startDate, endDate } = params;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const repo = this.expenseModel.tx.getRepository(ExpenseEntity);
    const qb = repo.createQueryBuilder('expense');

    // Always filter by user
    qb.where('expense.userId = :userId', { userId });

    //Search (case-insensitive)
    if (search) {
      qb.andWhere('(expense.title ILIKE :search OR expense.notes ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Category filter
    if (category) {
      qb.andWhere('expense.category = :category', { category });
    }

    // Date range filter
    if (startDate) {
      qb.andWhere('expense.date >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      qb.andWhere('expense.date <= :endDate', { endDate: new Date(endDate) });
    }

    // Sorting (safe whitelist)
    const sortableColumns = ['title', 'amount', 'date', 'category', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      qb.orderBy(`expense.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    } else {
      qb.orderBy('expense.date', 'DESC'); // default
    }

    // Pagination (support -1 = all)
    if (currentLimit !== -1) {
      qb.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    // Execute query
    const [expenses, count] = await qb.getManyAndCount();

    // Map to domain objects
    const result = expenses.map((expense) => ExpenseTypeOrmRepository.toDomain(expense));

    // Meta info
    const totalPages = currentLimit === -1 ? 1 : Math.ceil(count / currentLimit);
    const meta = StrictBuilder<GetAllMetaType>()
      .page(currentPage)
      .limit(currentLimit)
      .total(count)
      .totalPages(totalPages)
      .build();

    return StrictBuilder<GetAllExpensesReturnType>().result(result).meta(meta).build();
  }

  async getByIdAndUserId({ id, userId }: { id: ExpenseId; userId: UserId }): Promise<IExpense | undefined> {
    const expense = await this.expenseModel.tx.getRepository(ExpenseEntity).findOne({
      where: {
        uuid: id,
        userId: userId,
      },
    });
    return expense ? ExpenseTypeOrmRepository.toDomain(expense) : undefined;
  }

  async updateByIdAndUserId(expense: IExpense): Promise<IExpense> {
    await this.expenseModel.tx
      .getRepository(ExpenseEntity)
      .update({ uuid: expense.uuid, userId: expense.userId }, expense);

    const updatedExpense = await this.expenseModel.tx.getRepository(ExpenseEntity).findOne({
      where: {
        uuid: expense.uuid,
        userId: expense.userId,
      },
    });
    return ExpenseTypeOrmRepository.toDomain(updatedExpense!);
  }

  async getExpenseReport(query: GetExpenseReportQuery): Promise<ExpenseReportReturnType> {
    const { userId, startDate, endDate } = query;

    const baseQB = this.expenseModel.tx.getRepository(ExpenseEntity).createQueryBuilder('expense');

    // Filter
    baseQB.where('expense.userId = :userId', { userId });
    if (startDate) baseQB.andWhere('expense.date >= :startDate', { startDate });
    if (endDate) baseQB.andWhere('expense.date <= :endDate', { endDate });

    // --- Total summary ---
    const totalQB = baseQB.clone();
    const totalResult = await totalQB
      .select('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.uuid)', 'totalExpenses')
      .getRawOne();

    // --- Category summary ---
    const categoryQB = baseQB.clone();
    const categoryResults = await categoryQB
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .addSelect('COUNT(expense.uuid)', 'count')
      .groupBy('expense.category')
      .orderBy('total', 'DESC')
      .getRawMany();

    const categories: ExpensesByCategory[] = categoryResults.map((result) => ({
      category: result.category,
      total: Number(result.total) || 0,
      count: parseInt(result.count) || 0,
    }));

    return {
      totalAmount: Number(totalResult?.totalAmount) || 0,
      totalExpenses: parseInt(totalResult?.totalExpenses) || 0,
      categories,
      dateRange: { startDate, endDate },
    };
  }

  public static toDomain(expenseEntity: ExpenseEntity): IExpense {
    const amount = Number(expenseEntity.amount.toString()) as ExpenseAmount;
    return Builder(Expense)
      .uuid(expenseEntity.uuid)
      .title(expenseEntity.title)
      .amount(amount)
      .date(expenseEntity.date)
      .category(expenseEntity.category)
      .notes(expenseEntity.notes)
      .userId(expenseEntity.userId)
      .createdAt(expenseEntity.createdAt)
      .updatedAt(expenseEntity.updatedAt)
      .build();
  }
}
