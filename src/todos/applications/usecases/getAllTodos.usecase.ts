import { Inject, Injectable } from '@nestjs/common';
import type { GetAllTodosQuery, GetAllTodosReturnType, TodoRepository } from '../ports/todo.repository';
import { todoRepositoryToken } from '../ports/todo.repository';

@Injectable()
export class GetAllTodosUseCase {
  constructor(
    @Inject(todoRepositoryToken)
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(query: GetAllTodosQuery): Promise<GetAllTodosReturnType> {
    return this.todoRepository.getAll(query);
  }
}
