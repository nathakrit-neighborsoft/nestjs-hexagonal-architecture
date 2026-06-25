import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import type { DroneId } from 'src/drones/applications/domains/drone.domain';
import type { TodoDescription, TodoTitle } from '../../../applications/domains/todo.domain';

export class CreateTodoDto {
  @ApiProperty({ example: 'Replace propeller on drone #A1', description: 'The title of the todo' })
  @IsString() @IsNotEmpty()
  title: TodoTitle;

  @ApiProperty({ example: 'Need to replace the front-left propeller before next flight', required: false, description: 'Optional description' })
  @IsOptional() @IsString()
  description?: TodoDescription;

  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111', required: false, description: 'Optional drone ID to associate this todo with' })
  @IsOptional() @IsUUID()
  droneId?: DroneId;
}
