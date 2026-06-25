import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class DroneQueryDto {
  @ApiPropertyOptional({ description: 'Search term for company, model, or full name', example: 'DJI' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['company', 'model', 'fullName', 'priceRTF', 'createdAt'], example: 'createdAt' })
  @IsOptional() @IsIn(['company', 'model', 'fullName', 'priceRTF', 'createdAt'])
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
