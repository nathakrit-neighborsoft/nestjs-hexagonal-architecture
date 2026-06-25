import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import type {
  ExpenseAmount,
  ExpenseCategory,
  ExpenseNotes,
  ExpenseTitle,
} from '../../../applications/domains/expense.domain';

export class CreateExpenseDto {
  @ApiProperty({
    type: String,
    example: 'Grocery Shopping',
    description: 'The title of the expense',
  })
  @IsString()
  @IsNotEmpty()
  title: ExpenseTitle;

  @ApiProperty({
    type: Number,
    example: 150.75,
    description: 'The amount of the expense',
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: ExpenseAmount;

  @ApiProperty({
    type: String,
    example: '2024-01-15',
    description: 'The date of the expense (ISO date string)',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    type: String,
    example: 'Food',
    description: 'The category of the expense',
    enum: [
      'Food',
      'Transportation',
      'Entertainment',
      'Healthcare',
      'Utilities',
      'Shopping',
      'Education',
      'Travel',
      'Other',
    ],
  })
  @IsString()
  @IsNotEmpty()
  category: ExpenseCategory;

  @ApiProperty({
    type: String,
    example: 'Weekly groceries from the local supermarket',
    description: 'Optional notes about the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: ExpenseNotes;
}
