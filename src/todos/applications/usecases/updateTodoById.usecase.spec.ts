import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import type { UserId } from 'src/types/utility.type';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { TodoId, ITodo } from '../domains/todo.domain';
import { TodoRepository } from '../ports/todo.repository';
import { UpdateTodoByIdUseCase } from './updateTodoById.usecase';

describe('UpdateTodoByIdUseCase', () => {
  let useCase: UpdateTodoByIdUseCase;
  const todoRepository = mock<TodoRepository>();

  beforeEach(() => {
    useCase = new UpdateTodoByIdUseCase(todoRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const todoId = faker.string.uuid() as TodoId;
  const userId = faker.string.uuid() as UserId;

  it('should update todo successfully', async () => {
    const existingTodo = mock<ITodo>({ uuid: todoId, userId });
    const command = Builder<ITodo>().uuid(todoId).userId(userId).build();
    todoRepository.getByIdAndUserId.mockResolvedValue(existingTodo);
    todoRepository.updateByIdAndUserId.mockResolvedValue(existingTodo);

    const actual = await useCase.execute(command);

    expect(actual).toEqual(existingTodo);
    expect(todoRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
    expect(todoRepository.updateByIdAndUserId).toHaveBeenCalledWith(command);
  });

  it('should throw error when todo not found', async () => {
    const command = mock<ITodo>({ uuid: todoId, userId });
    const errorExpected = new NotFoundException('Todo not found');
    todoRepository.getByIdAndUserId.mockResolvedValue(undefined);

    const promise = useCase.execute(command);

    await expect(promise).rejects.toThrow(errorExpected);
    expect(todoRepository.getByIdAndUserId).toHaveBeenCalledWith({ id: todoId, userId });
    expect(todoRepository.updateByIdAndUserId).not.toHaveBeenCalled();
  });
});
