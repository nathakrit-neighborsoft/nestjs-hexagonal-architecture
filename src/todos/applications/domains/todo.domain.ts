import { Brand, CreatedAt, UpdatedAt } from 'src/types/utility.type';
import type { DroneId } from 'src/drones/applications/domains/drone.domain';
import type { UserId } from 'src/types/utility.type';

export type TodoId = Brand<string, 'TodoId'>;
export type TodoTitle = Brand<string, 'TodoTitle'>;
export type TodoDescription = Brand<string, 'TodoDescription'>;
export type TodoCompleted = Brand<boolean, 'TodoCompleted'>;
export type TodoCreatedAt = Brand<CreatedAt, 'TodoCreatedAt'>;
export type TodoUpdatedAt = Brand<UpdatedAt, 'TodoUpdatedAt'>;

export interface ITodo {
  uuid: TodoId;
  userId: UserId;
  droneId?: DroneId;
  title: TodoTitle;
  description: TodoDescription;
  completed: TodoCompleted;
  createdAt?: TodoCreatedAt;
  updatedAt?: TodoUpdatedAt;
}

export class Todo implements ITodo {
  uuid: TodoId;
  userId: UserId;
  droneId?: DroneId;
  title: TodoTitle;
  description: TodoDescription;
  completed: TodoCompleted;
  createdAt?: TodoCreatedAt;
  updatedAt?: TodoUpdatedAt;
}
