import { GetAllParamsType, GetAllMetaType } from 'src/types/utility.type';
import type { DroneId } from 'src/drones/applications/domains/drone.domain';
import type { UserId } from 'src/types/utility.type';
import type { ITodo, TodoId } from '../domains/todo.domain';

export type UpdateTodoCommand = Partial<Omit<ITodo, 'uuid' | 'userId' | 'createdAt' | 'updatedAt'>>;

export interface GetAllTodosQuery extends GetAllParamsType {
  userId: UserId;
  droneId?: DroneId;
}

export interface GetAllTodosReturnType {
  result: ITodo[];
  meta: GetAllMetaType;
}

const todoRepositoryTokenSymbol: unique symbol = Symbol('TodoRepository');
export const todoRepositoryToken = todoRepositoryTokenSymbol.toString();

export interface TodoRepository {
  create(todo: ITodo): Promise<ITodo>;
  getAll(query: GetAllTodosQuery): Promise<GetAllTodosReturnType>;
  getByIdAndUserId({ id, userId }: { id: TodoId; userId: UserId }): Promise<ITodo | undefined>;
  updateByIdAndUserId(todo: ITodo): Promise<ITodo>;
  toggleCompletedByIdAndUserId({ id, userId }: { id: TodoId; userId: UserId }): Promise<ITodo>;
  deleteByIdAndUserId({ id, userId }: { id: TodoId; userId: UserId }): Promise<void>;
}
