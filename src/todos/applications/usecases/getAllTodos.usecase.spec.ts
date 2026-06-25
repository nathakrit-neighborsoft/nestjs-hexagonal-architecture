import { faker } from '@faker-js/faker';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
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
import { GetAllTodosQuery, GetAllTodosReturnType, TodoRepository } from '../ports/todo.repository';
import { GetAllTodosUseCase } from './getAllTodos.usecase';

describe('GetAllTodosUseCase', () => {
  let useCase: GetAllTodosUseCase;
  const todoRepository = mock<TodoRepository>();

  beforeEach(() => {
    useCase = new GetAllTodosUseCase(todoRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const userId = faker.string.uuid() as UserId;
  const droneId = faker.string.uuid() as DroneId;
  const todoId1 = faker.string.uuid() as TodoId;
  const todoId2 = faker.string.uuid() as TodoId;

  const mockTodo1 = Builder<ITodo>()
    .uuid(todoId1)
    .userId(userId)
    .droneId(droneId)
    .title(faker.lorem.sentence() as TodoTitle)
    .description(faker.lorem.paragraph() as TodoDescription)
    .completed(faker.datatype.boolean() as TodoCompleted)
    .createdAt(new Date() as TodoCreatedAt)
    .updatedAt(new Date() as TodoUpdatedAt)
    .build();

  const mockTodo2 = Builder<ITodo>()
    .uuid(todoId2)
    .userId(userId)
    .droneId(droneId)
    .title(faker.lorem.sentence() as TodoTitle)
    .description(faker.lorem.paragraph() as TodoDescription)
    .completed(faker.datatype.boolean() as TodoCompleted)
    .createdAt(new Date() as TodoCreatedAt)
    .updatedAt(new Date() as TodoUpdatedAt)
    .build();

  const mockMeta = StrictBuilder<GetAllMetaType>().total(2).page(1).limit(10).totalPages(1).build();

  it('should get all todos successfully', async () => {
    const query = StrictBuilder<GetAllTodosQuery>().userId(userId).droneId(droneId).page(1).limit(10).build();
    const expectedResult = StrictBuilder<GetAllTodosReturnType>().result([mockTodo1, mockTodo2]).meta(mockMeta).build();

    todoRepository.getAll.mockResolvedValue(expectedResult);

    const actual = await useCase.execute(query);

    expect(actual).toEqual(expectedResult);
    expect(todoRepository.getAll).toHaveBeenCalledWith(query);
    expect(todoRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when getting todos', async () => {
    const query = StrictBuilder<GetAllTodosQuery>().userId(userId).droneId(droneId).page(1).limit(10).build();
    const expectedError = new Error('Database connection failed');
    todoRepository.getAll.mockRejectedValue(expectedError);

    const promise = useCase.execute(query);

    await expect(promise).rejects.toThrow(expectedError);
    expect(todoRepository.getAll).toHaveBeenCalledWith(query);
    expect(todoRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
