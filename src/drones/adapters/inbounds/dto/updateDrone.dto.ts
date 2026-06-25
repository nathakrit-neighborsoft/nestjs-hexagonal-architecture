import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import type {
  DroneCompany, DroneModel, DroneFullName, DronePriceRTF,
  DroneTankCapacity, DroneFlightSpeed, DroneSprayWidth,
  DroneCoveragePerDay, DroneRtfEquipment,
} from '../../../applications/domains/drone.domain';

@ApiSchema({ name: 'UpdateDrone' })
export class UpdateDroneDto {
  @ApiPropertyOptional({ example: 'DJI', description: 'Drone manufacturer company' })
  @IsOptional() @IsString()
  company?: DroneCompany;

  @ApiPropertyOptional({ example: 'T40', description: 'Drone model name' })
  @IsOptional() @IsString()
  model?: DroneModel;

  @ApiPropertyOptional({ example: 'DJI Agras T40', description: 'Full name of the drone' })
  @IsOptional() @IsString()
  fullName?: DroneFullName;

  @ApiPropertyOptional({ example: 12000, minimum: 0, description: 'Price RTF' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  priceRTF?: DronePriceRTF;

  @ApiPropertyOptional({ example: 40, minimum: 0, description: 'Tank capacity (L)' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  tankCapacity?: DroneTankCapacity;

  @ApiPropertyOptional({ example: 10, minimum: 0, description: 'Flight speed (m/s)' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  flightSpeed?: DroneFlightSpeed;

  @ApiPropertyOptional({ example: 11, minimum: 0, description: 'Spray width (m)' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  sprayWidth?: DroneSprayWidth;

  @ApiPropertyOptional({ example: 40, minimum: 0, description: 'Coverage per day (ha)' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  coveragePerDay?: DroneCoveragePerDay;

  @ApiPropertyOptional({ example: 'Includes 2 batteries + charger', description: 'RTF equipment details' })
  @IsOptional() @IsString()
  rtfEquipment?: DroneRtfEquipment;
}
