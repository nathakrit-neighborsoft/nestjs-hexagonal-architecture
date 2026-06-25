import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import type { UserId } from 'src/types/utility.type';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { TodoId, ITodo } from '../domains/todo.domain';
import { TodoRepository } from '../ports/todo.repository';
import { DeleteTodoByIdUseCase } from './deleteTodoById.usecase';

describe('DeleteTodoByIdUseCase', () => {
  let useCase: DeleteTodoByIdUseCase;
  const todoRepository = mock<TodoRepository>();

  beforeEach(() => {
    useCase = new DeleteTodoByIdUseCase(todoRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const todoId = faker.string.uuid() as TodoId;
  const userId = faker.string.uuid() as UserId;

  it('should delete todo successfully', async () => {
    todoRepository.getByIdAndUserId.mockResolvedValue(mock<ITodo>({ uuid: todoId }));
    todoRepository.deleteByIdAndUserId.mockResolvedValue(undefined);

    const actual = await useCase.execute({ id: todoId, userId });

    expect(actual).toBeUndefined();
    expect(todoRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
    expect(todoRepository.deleteByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
  });

  it('should throw error when todo not found', async () => {
    const errorExpected = new NotFoundException('Todo not found');
    todoRepository.getByIdAndUserId.mockResolvedValue(undefined);

    const promise = useCase.execute({ id: todoId, userId });

    await expect(promise).rejects.toThrow(errorExpected);
    expect(todoRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
    expect(todoRepository.deleteByIdAndUserId).not.toHaveBeenCalled();
  });
});
