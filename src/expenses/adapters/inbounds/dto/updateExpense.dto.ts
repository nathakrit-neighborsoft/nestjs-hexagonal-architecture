import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import type {
  ExpenseAmount,
  ExpenseCategory,
  ExpenseNotes,
  ExpenseTitle,
} from '../../../applications/domains/expense.domain';

export class UpdateExpenseDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Updated Grocery Shopping',
    description: 'The title of the expense',
  })
  @IsOptional()
  @IsString()
  title?: ExpenseTitle;

  @ApiPropertyOptional({
    type: Number,
    example: 175.5,
    description: 'The amount of the expense',
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount?: ExpenseAmount;

  @ApiPropertyOptional({
    type: String,
    example: '2024-01-16',
    description: 'The date of the expense (ISO date string)',
  })
  @IsOptional()
  @IsDateString()
  date?: string; // Will be converted to Date in the controller

  @ApiPropertyOptional({
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
  @IsOptional()
  @IsString()
  category?: ExpenseCategory;

  @ApiPropertyOptional({
    type: String,
    example: 'Updated notes about the expense',
    description: 'Optional notes about the expense',
  })
  @IsOptional()
  @IsString()
  notes?: ExpenseNotes;
}
