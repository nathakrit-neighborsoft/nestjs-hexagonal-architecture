import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UserId } from 'src/types/utility.type';
import type { ITodo, TodoId } from '../domains/todo.domain';
import type { TodoRepository } from '../ports/todo.repository';
import { todoRepositoryToken } from '../ports/todo.repository';

@Injectable()
export class GetTodoByIdUseCase {
  constructor(
    @Inject(todoRepositoryToken)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute({ id, userId }: { id: TodoId; userId: UserId }): Promise<ITodo> {
    const todo = await this.todoRepository.getByIdAndUserId({ id, userId });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }
}
