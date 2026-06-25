import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import type { DroneId } from 'src/drones/applications/domains/drone.domain';
import type { TodoCompleted, TodoDescription, TodoTitle } from '../../../applications/domains/todo.domain';

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'Replace propeller on drone #A1', description: 'The title of the todo' })
  @IsOptional() @IsString()
  title?: TodoTitle;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Optional description' })
  @IsOptional() @IsString()
  description?: TodoDescription;

  @ApiPropertyOptional({ example: true, description: 'Completion status' })
  @IsOptional() @IsBoolean()
  completed?: TodoCompleted;

  @ApiPropertyOptional({ example: '11111111-1111-1111-1111-111111111111', description: 'Optional drone ID to associate this todo with. Pass null to unlink.' })
  @IsOptional() @IsUUID()
  droneId?: DroneId | null;
}
