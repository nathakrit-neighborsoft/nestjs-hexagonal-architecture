import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import type { UserId } from 'src/types/utility.type';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { TodoId, ITodo } from '../domains/todo.domain';
import { TodoRepository } from '../ports/todo.repository';
import { ToggleTodoByIdUseCase } from './toggleTodoById.usecase';

describe('ToggleTodoByIdUseCase', () => {
  let useCase: ToggleTodoByIdUseCase;
  const todoRepository = mock<TodoRepository>();

  beforeEach(() => {
    useCase = new ToggleTodoByIdUseCase(todoRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const todoId = faker.string.uuid() as TodoId;
  const userId = faker.string.uuid() as UserId;

  it('should toggle todo completed successfully', async () => {
    const todo = mock<ITodo>({ uuid: todoId, userId });
    todoRepository.getByIdAndUserId.mockResolvedValue(todo);
    todoRepository.toggleCompletedByIdAndUserId.mockResolvedValue(todo);

    const actual = await useCase.execute({ id: todoId, userId });

    expect(actual).toEqual(todo);
    expect(todoRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
    expect(todoRepository.toggleCompletedByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
  });

  it('should throw error when todo not found', async () => {
    todoRepository.getByIdAndUserId.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('Todo not found');

    const promise = useCase.execute({ id: todoId, userId });

    await expect(promise).rejects.toThrow(errorExpected);
    expect(todoRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
    expect(todoRepository.toggleCompletedByIdAndUserId).not.toHaveBeenCalled();
  });
});
