import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import type {
  DroneCompany, DroneModel, DroneFullName, DronePriceRTF,
  DroneTankCapacity, DroneFlightSpeed, DroneSprayWidth,
  DroneCoveragePerDay, DroneRtfEquipment,
} from '../../../applications/domains/drone.domain';

export class CreateDroneDto {
  @ApiProperty({ example: 'DJI', description: 'Drone manufacturer company' })
  @IsString() @IsNotEmpty()
  company: DroneCompany;

  @ApiProperty({ example: 'T40', description: 'Drone model name' })
  @IsString() @IsNotEmpty()
  model: DroneModel;

  @ApiProperty({ example: 'DJI Agras T40', description: 'Full name of the drone' })
  @IsString() @IsNotEmpty()
  fullName: DroneFullName;

  @ApiProperty({ example: 12000, minimum: 0, description: 'Price RTF' })
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  priceRTF: DronePriceRTF;

  @ApiProperty({ example: 40, minimum: 0, description: 'Tank capacity (L)' })
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  tankCapacity: DroneTankCapacity;

  @ApiProperty({ example: 10, minimum: 0, description: 'Flight speed (m/s)' })
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  flightSpeed: DroneFlightSpeed;

  @ApiProperty({ example: 11, minimum: 0, description: 'Spray width (m)' })
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  sprayWidth: DroneSprayWidth;

  @ApiProperty({ example: 40, minimum: 0, description: 'Coverage per day (ha)' })
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  coveragePerDay: DroneCoveragePerDay;

  @ApiProperty({ example: 'Includes 2 batteries + charger', required: false, description: 'RTF equipment details' })
  @IsOptional() @IsString()
  rtfEquipment?: DroneRtfEquipment;
}
