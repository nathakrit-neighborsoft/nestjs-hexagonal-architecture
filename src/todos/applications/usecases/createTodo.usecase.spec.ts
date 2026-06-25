import { faker } from '@faker-js/faker';
import { Builder } from 'builder-pattern';
import type { UserId } from 'src/types/utility.type';
import { DroneId } from 'src/drones/applications/domains/drone.domain';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  TodoId,
  TodoTitle,
  TodoDescription,
  TodoCompleted,
  TodoCreatedAt,
  TodoUpdatedAt,
  ITodo,
} from '../domains/todo.domain';
import { TodoRepository } from '../ports/todo.repository';
import { CreateTodoUseCase } from './createTodo.usecase';

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;
  const todoRepository = mock<TodoRepository>();

  beforeEach(() => {
    useCase = new CreateTodoUseCase(todoRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const todoId = faker.string.uuid() as TodoId;
  const userId = faker.string.uuid() as UserId;
  const droneId = faker.string.uuid() as DroneId;
  const todoData = Builder<ITodo>()
    .uuid(todoId)
    .userId(userId)
    .droneId(droneId)
    .title(faker.lorem.sentence() as TodoTitle)
    .description(faker.lorem.paragraph() as TodoDescription)
    .completed(faker.datatype.boolean() as TodoCompleted)
    .createdAt(new Date() as TodoCreatedAt)
    .updatedAt(new Date() as TodoUpdatedAt)
    .build();

  it('should create todo successfully', async () => {
    todoRepository.create.mockResolvedValue(todoData);
    const actual = await useCase.execute(todoData);
    expect(actual).toEqual(todoData);
    expect(todoRepository.create).toHaveBeenCalledWith(todoData);
    expect(todoRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when creating todo', async () => {
    const expectedError = new Error('Database connection failed');
    todoRepository.create.mockRejectedValue(expectedError);
    const promise = useCase.execute(todoData);
    await expect(promise).rejects.toThrow(expectedError);
    expect(todoRepository.create).toHaveBeenCalledWith(todoData);
  });
});
