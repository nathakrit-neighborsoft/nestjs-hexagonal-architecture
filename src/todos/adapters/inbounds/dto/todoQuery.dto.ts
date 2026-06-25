import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class TodoQueryDto {
  @ApiPropertyOptional({ description: 'Filter by drone ID', example: '11111111-1111-1111-1111-111111111111' })
  @IsOptional() @IsUUID()
  droneId?: string;

  @ApiPropertyOptional({ description: 'Search term for title or description', example: 'propeller' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['title', 'completed', 'createdAt'], example: 'createdAt' })
  @IsOptional() @IsIn(['title', 'completed', 'createdAt'])
  sort?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'], example: 'DESC' })
  @IsOptional() @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Page number (starts from 1)', example: 1 })
  @IsOptional() @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page (-1 for all)', example: 10 })
  @IsOptional() @Transform(({ value }) => parseInt(value))
  limit?: number;
}
