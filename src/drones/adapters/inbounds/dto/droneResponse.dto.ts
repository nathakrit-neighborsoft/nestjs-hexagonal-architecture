import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'DroneResponse' })
export class DroneResponseDto {
  @ApiProperty({ format: 'uuid' })
  uuid: string;

  @ApiProperty() company: string;
  @ApiProperty() model: string;
  @ApiProperty() fullName: string;
  @ApiProperty({ type: Number }) priceRTF: number;
  @ApiProperty({ type: Number }) tankCapacity: number;
  @ApiProperty({ type: Number }) flightSpeed: number;
  @ApiProperty({ type: Number }) sprayWidth: number;
  @ApiProperty({ type: Number }) coveragePerDay: number;
  @ApiProperty() rtfEquipment: string;

  @ApiProperty({ required: false }) createdAt?: Date;
  @ApiProperty({ required: false }) updatedAt?: Date;
}
