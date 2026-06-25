import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type ITodo } from '../domains/todo.domain';
import type { TodoRepository } from '../ports/todo.repository';
import { todoRepositoryToken } from '../ports/todo.repository';

@Injectable()
export class UpdateTodoByIdUseCase {
  constructor(
    @Inject(todoRepositoryToken)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(todo: ITodo): Promise<ITodo> {
    const existingTodo = await this.todoRepository.getByIdAndUserId({ id: todo.uuid, userId: todo.userId });
    if (!existingTodo) throw new NotFoundException('Todo not found');

    return this.todoRepository.updateByIdAndUserId(todo);
  }
}
