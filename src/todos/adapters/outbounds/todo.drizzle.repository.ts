import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import type { UserId } from 'src/types/utility.type';
import { DroneId } from 'src/drones/applications/domains/drone.domain';
import { todos } from 'src/databases/schemas';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/databases/schemas';
import type { SQL } from 'drizzle-orm';
import {
  ITodo,
  Todo,
  TodoCompleted,
  TodoCreatedAt,
  TodoDescription,
  TodoId,
  TodoTitle,
  TodoUpdatedAt,
} from '../../applications/domains/todo.domain';
import {
  GetAllTodosQuery,
  GetAllTodosReturnType,
  TodoRepository,
} from '../../applications/ports/todo.repository';

type DrizzleDB = NodePgDatabase<typeof schema>;

@Injectable()
export class TodoDrizzleRepository implements TodoRepository {
  constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm<DrizzleDB>>) {}

  async create(todo: ITodo): Promise<ITodo> {
    const [result] = await this.model.tx
      .insert(todos)
      .values({
        userId: todo.userId,
        droneId: todo.droneId,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      })
      .returning();
    return TodoDrizzleRepository.toDomain(result);
  }

  async getAll(params: GetAllTodosQuery): Promise<GetAllTodosReturnType> {
    const { search, sort, order, page, limit, userId, droneId } = params;
    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const conditions: (SQL | undefined)[] = [eq(todos.userId, userId)];

    if (droneId) conditions.push(eq(todos.droneId, droneId));
    if (search) {
      conditions.push(
        or(ilike(todos.title, `%${search}%`), ilike(todos.description, `%${search}%`))!,
      );
    }

    const where = and(...conditions.filter(Boolean) as SQL[]);

    const [{ count: total }] = await this.model.tx
      .select({ count: count() })
      .from(todos)
      .where(where!);

    const orderByClause =
      sort && ['title', 'completed', 'createdAt'].includes(sort)
        ? order === 'ASC'
          ? asc((todos as any)[sort])
          : desc((todos as any)[sort])
        : desc(todos.createdAt);

    const effectiveLimit = currentLimit === -1 ? 999999 : currentLimit;
    const effectiveOffset = currentLimit === -1 ? 0 : (currentPage - 1) * currentLimit;
    const rows = await this.model.tx
      .select()
      .from(todos)
      .where(where!)
      .orderBy(orderByClause)
      .limit(effectiveLimit)
      .offset(effectiveOffset);

    const result = rows.map(TodoDrizzleRepository.toDomain);
    const totalPages = currentLimit === -1 ? 1 : Math.ceil(Number(total) / currentLimit);

    return StrictBuilder<GetAllTodosReturnType>()
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

  async getByIdAndUserId({ id, userId }: { id: TodoId; userId: UserId }): Promise<ITodo | undefined> {
    const [result] = await this.model.tx
      .select()
      .from(todos)
      .where(and(eq(todos.uuid, id), eq(todos.userId, userId)))
      .limit(1);
    return result ? TodoDrizzleRepository.toDomain(result) : undefined;
  }

  async updateByIdAndUserId(todo: ITodo): Promise<ITodo> {
    const [result] = await this.model.tx
      .update(todos)
      .set({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        droneId: todo.droneId ?? null,
      })
      .where(and(eq(todos.uuid, todo.uuid), eq(todos.userId, todo.userId)))
      .returning();
    return TodoDrizzleRepository.toDomain(result);
  }

  async toggleCompletedByIdAndUserId({ id, userId }: { id: TodoId; userId: UserId }): Promise<ITodo> {
    const [result] = await this.model.tx
      .update(todos)
      .set({ completed: sql`NOT ${todos.completed}` })
      .where(and(eq(todos.uuid, id), eq(todos.userId, userId)))
      .returning();
    return TodoDrizzleRepository.toDomain(result);
  }

  async deleteByIdAndUserId({ id, userId }: { id: TodoId; userId: UserId }): Promise<void> {
    await this.model.tx
      .delete(todos)
      .where(and(eq(todos.uuid, id), eq(todos.userId, userId)));
  }

  static toDomain(row: typeof todos.$inferSelect): ITodo {
    return Builder(Todo)
      .uuid(row.uuid as TodoId)
      .userId(row.userId as UserId)
      .droneId((row.droneId as DroneId) ?? undefined)
      .title(row.title as TodoTitle)
      .description((row.description ?? '') as TodoDescription)
      .completed(row.completed as TodoCompleted)
      .createdAt(row.createdAt as TodoCreatedAt)
      .updatedAt(row.updatedAt as TodoUpdatedAt)
      .build();
  }
}
