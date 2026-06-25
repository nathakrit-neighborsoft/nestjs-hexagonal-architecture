import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TodoController } from './adapters/inbounds/todo.controller';
import { TodoDrizzleRepository } from './adapters/outbounds/todo.drizzle.repository';
import { todoRepositoryToken } from './applications/ports/todo.repository';
import { CreateTodoUseCase } from './applications/usecases/createTodo.usecase';
import { DeleteTodoByIdUseCase } from './applications/usecases/deleteTodoById.usecase';
import { GetAllTodosUseCase } from './applications/usecases/getAllTodos.usecase';
import { GetTodoByIdUseCase } from './applications/usecases/getTodoById.usecase';
import { ToggleTodoByIdUseCase } from './applications/usecases/toggleTodoById.usecase';
import { UpdateTodoByIdUseCase } from './applications/usecases/updateTodoById.usecase';

@Module({
  imports: [AuthModule],
  controllers: [TodoController],
  providers: [
    { provide: todoRepositoryToken, useClass: TodoDrizzleRepository },
    CreateTodoUseCase,
    DeleteTodoByIdUseCase,
    GetAllTodosUseCase,
    GetTodoByIdUseCase,
    ToggleTodoByIdUseCase,
    UpdateTodoByIdUseCase,
  ],
})
export class TodosModule {}
