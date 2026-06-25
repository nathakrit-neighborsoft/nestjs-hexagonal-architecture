import { Transactional } from '@nestjs-cls/transactional';
import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, Put, Query, Request, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder, StrictBuilder } from 'builder-pattern';
import { AuthGuard } from 'src/auth/auth.guard';
import type { DroneId } from 'src/drones/applications/domains/drone.domain';
import type { UserId } from 'src/types/utility.type';
import type { ITodo, Todo, TodoCompleted, TodoDescription, TodoId } from '../../applications/domains/todo.domain';
import { GetAllTodosQuery } from '../../applications/ports/todo.repository';
import { CreateTodoUseCase } from '../../applications/usecases/createTodo.usecase';
import { DeleteTodoByIdUseCase } from '../../applications/usecases/deleteTodoById.usecase';
import { GetAllTodosUseCase } from '../../applications/usecases/getAllTodos.usecase';
import { GetTodoByIdUseCase } from '../../applications/usecases/getTodoById.usecase';
import { ToggleTodoByIdUseCase } from '../../applications/usecases/toggleTodoById.usecase';
import { UpdateTodoByIdUseCase } from '../../applications/usecases/updateTodoById.usecase';
import { CreateTodoDto } from './dto/createTodo.dto';
import { TodoQueryDto } from './dto/todoQuery.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';

interface AuthenticatedRequest extends Request {
  user: { userId: string; username: string };
}

@UseGuards(AuthGuard)
@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getAllTodosUseCase: GetAllTodosUseCase,
    private readonly getTodoByIdUseCase: GetTodoByIdUseCase,
    private readonly updateTodoByIdUseCase: UpdateTodoByIdUseCase,
    private readonly toggleTodoByIdUseCase: ToggleTodoByIdUseCase,
    private readonly deleteTodoByIdUseCase: DeleteTodoByIdUseCase,
  ) {}

  @Get()
  @Transactional()
  @ApiOperation({ summary: 'Get all todos for the authenticated user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Todos retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async getAll(@Query() queryDto: TodoQueryDto, @Request() req: AuthenticatedRequest) {
    const query = StrictBuilder<GetAllTodosQuery>()
      .userId(req.user.userId as UserId)
      .droneId(queryDto.droneId as DroneId)
      .search(queryDto.search)
      .sort(queryDto.sort)
      .order(queryDto.order)
      .page(queryDto.page)
      .limit(queryDto.limit)
      .build();
    return this.getAllTodosUseCase.execute(query);
  }

  @Get(':id')
  @Transactional()
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Todo retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the todo' })
  async getById(@Param('id', ParseUUIDPipe) id: TodoId, @Request() req: AuthenticatedRequest) {
    return this.getTodoByIdUseCase.execute({ id, userId: req.user.userId as UserId });
  }

  @Post()
  @Transactional()
  @ApiOperation({ summary: 'Create a todo' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Todo created successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid todo data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req: AuthenticatedRequest) {
    const todo = Builder<ITodo>()
      .userId(req.user.userId as UserId)
      .title(createTodoDto.title)
      .description((createTodoDto.description ?? '') as TodoDescription)
      .droneId(createTodoDto.droneId as DroneId)
      .completed(false as TodoCompleted)
      .build();
    return this.createTodoUseCase.execute(todo);
  }

  @Put(':id')
  @Transactional()
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Todo updated successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid todo data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the todo' })
  async update(
    @Param('id', ParseUUIDPipe) id: TodoId,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const todo = Builder<Todo>()
      .uuid(id)
      .userId(req.user.userId as UserId)
      .title(updateTodoDto.title as any)
      .description(updateTodoDto.description as any)
      .completed(updateTodoDto.completed as any)
      .droneId(updateTodoDto.droneId as DroneId)
      .build();
    return this.updateTodoByIdUseCase.execute(todo);
  }

  @Patch(':id/toggle')
  @Transactional()
  @ApiOperation({ summary: 'Toggle todo completion status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Todo toggled successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the todo' })
  async toggle(@Param('id', ParseUUIDPipe) id: TodoId, @Request() req: AuthenticatedRequest) {
    return this.toggleTodoByIdUseCase.execute({ id, userId: req.user.userId as UserId });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Transactional()
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Todo deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the todo' })
  async delete(@Param('id', ParseUUIDPipe) id: TodoId, @Request() req: AuthenticatedRequest) {
    await this.deleteTodoByIdUseCase.execute({ id, userId: req.user.userId as UserId });
  }
}
