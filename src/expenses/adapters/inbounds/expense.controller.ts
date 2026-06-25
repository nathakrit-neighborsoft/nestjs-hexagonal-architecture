import { Transactional } from '@nestjs-cls/transactional';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder, StrictBuilder } from 'builder-pattern';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { accessKeyToken } from 'src/configs/jwt.config';
import { UserId } from 'src/users/applications/domains/user.domain';
import type {
  Expense,
  ExpenseAmount,
  ExpenseCategory,
  ExpenseDate,
  ExpenseId,
  ExpenseNotes,
  ExpenseTitle,
  IExpense,
} from '../../applications/domains/expense.domain';
import { GetAllExpensesQuery, GetExpenseReportQuery } from '../../applications/ports/expense.repository';
import { CreateExpenseUseCase } from '../../applications/usecases/createExpense.usecase';
import { DeleteExpenseByIdUseCase } from '../../applications/usecases/deleteExpenseById.usecase';
import { GetAllExpensesUseCase } from '../../applications/usecases/getAllExpenses.usecase';
import { GetExpenseByIdUseCase } from '../../applications/usecases/getExpenseById.usecase';
import { GetExpenseReportUseCase } from '../../applications/usecases/getExpenseReport.usecase';
import { UpdateExpenseByIdUseCase } from '../../applications/usecases/updateExpenseById.usecase';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { ExpenseQueryDto } from './dto/expenseQuery.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth(accessKeyToken)
@ApiTags('expenses')
@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly deleteExpenseByIdUseCase: DeleteExpenseByIdUseCase,
    private readonly getAllExpensesUseCase: GetAllExpensesUseCase,
    private readonly updateExpenseByIdUseCase: UpdateExpenseByIdUseCase,
    private readonly getExpenseByIdUseCase: GetExpenseByIdUseCase,
    private readonly getExpenseReportUseCase: GetExpenseReportUseCase,
  ) {}

  @ApiOperation({ summary: 'Create an expense' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The expense has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid expense data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  async create(@Body() createExpenseDto: CreateExpenseDto, @Request() req: AuthenticatedRequest) {
    const expense = Builder<IExpense>()
      .title(createExpenseDto.title)
      .amount(createExpenseDto.amount)
      .date(new Date(createExpenseDto.date) as ExpenseDate)
      .category(createExpenseDto.category)
      .notes(createExpenseDto.notes)
      .userId(req.user.userId as UserId)
      .build();

    return this.createExpenseUseCase.execute(expense);
  }

  @ApiOperation({ summary: 'Get all expenses for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The expenses have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Get()
  @Transactional()
  async getAll(@Query() queryDto: ExpenseQueryDto, @Request() req: AuthenticatedRequest) {
    const query = StrictBuilder<GetAllExpensesQuery>()
      .search(queryDto.search)
      .sort(queryDto.sort)
      .order(queryDto.order)
      .page(queryDto.page)
      .limit(queryDto.limit)
      .userId(req.user.userId as UserId)
      .category(queryDto.category)
      .startDate(queryDto.startDate ? new Date(queryDto.startDate) : undefined)
      .endDate(queryDto.endDate ? new Date(queryDto.endDate) : undefined)
      .build();

    return this.getAllExpensesUseCase.execute(query);
  }

  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The expense has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The expense not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense' })
  @Get(':id')
  @Transactional()
  async getById(@Param('id', ParseUUIDPipe) id: ExpenseId, @Request() req: AuthenticatedRequest) {
    return this.getExpenseByIdUseCase.execute({ id, userId: req.user.userId as UserId });
  }

  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The expense has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The expense not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid expense data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense' })
  @Put(':id')
  @Transactional()
  async update(
    @Param('id', ParseUUIDPipe) id: ExpenseId,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const date = updateExpenseDto.date ? new Date(updateExpenseDto.date) : new Date();
    const expense = Builder<Expense>()
      .uuid(id)
      .userId(req.user.userId as UserId)
      .title(updateExpenseDto.title as ExpenseTitle)
      .amount(updateExpenseDto.amount as ExpenseAmount)
      .date(date as ExpenseDate)
      .category(updateExpenseDto.category as ExpenseCategory)
      .notes(updateExpenseDto.notes as ExpenseNotes)
      .build();

    return this.updateExpenseByIdUseCase.execute(expense);
  }

  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The expense has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The expense not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense' })
  @Delete(':id')
  @Transactional()
  async delete(@Param('id', ParseUUIDPipe) id: ExpenseId, @Request() req: AuthenticatedRequest) {
    await this.deleteExpenseByIdUseCase.execute({ id, userId: req.user.userId as UserId });
  }

  @ApiOperation({ summary: 'Get expense report by category for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The expense report has been successfully generated.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Get('reports/by-category')
  @Transactional()
  async getReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: AuthenticatedRequest,
  ) {
    const query = StrictBuilder<GetExpenseReportQuery>()
      .userId(req!.user.userId as UserId)
      .startDate(startDate ? new Date(startDate) : undefined)
      .endDate(endDate ? new Date(endDate) : undefined)
      .build();

    return this.getExpenseReportUseCase.execute(query);
  }
}
