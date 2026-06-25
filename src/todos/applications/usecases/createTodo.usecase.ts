import { Inject, Injectable } from '@nestjs/common';
import { type ITodo } from '../domains/todo.domain';
import type { TodoRepository } from '../ports/todo.repository';
import { todoRepositoryToken } from '../ports/todo.repository';

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject(todoRepositoryToken)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(todo: ITodo): Promise<ITodo> {
    return this.todoRepository.create(todo);
  }
}
