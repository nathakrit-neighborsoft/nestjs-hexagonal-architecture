import { Transactional } from '@nestjs-cls/transactional';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder, StrictBuilder } from 'builder-pattern';
import { AuthGuard } from 'src/auth/auth.guard';
import type {
  Drone,
  DroneCompany,
  DroneCoveragePerDay,
  DroneFlightSpeed,
  DroneFullName,
  DroneId,
  DroneModel,
  DronePriceRTF,
  DroneRtfEquipment,
  DroneSprayWidth,
  DroneTankCapacity,
  IDrone,
} from '../../applications/domains/drone.domain';
import { GetAllDronesQuery } from '../../applications/ports/drone.repository';
import { CreateDroneUseCase } from '../../applications/usecases/createDrone.usecase';
import { DeleteDroneByIdUseCase } from '../../applications/usecases/deleteDroneById.usecase';
import { GetAllDronesUseCase } from '../../applications/usecases/getAllDrones.usecase';
import { GetDroneByIdUseCase } from '../../applications/usecases/getDroneById.usecase';
import { UpdateDroneByIdUseCase } from '../../applications/usecases/updateDroneById.usecase';
import { CreateDroneDto } from './dto/createDrone.dto';
import { DroneQueryDto } from './dto/droneQuery.dto';
import { DroneResponseDto } from './dto/droneResponse.dto';
import { UpdateDroneDto } from './dto/updateDrone.dto';

@ApiTags('drones')
@Controller('drones')
export class DroneController {
  constructor(
    private readonly createDroneUseCase: CreateDroneUseCase,
    private readonly getAllDronesUseCase: GetAllDronesUseCase,
    private readonly getDroneByIdUseCase: GetDroneByIdUseCase,
    private readonly updateDroneByIdUseCase: UpdateDroneByIdUseCase,
    private readonly deleteDroneByIdUseCase: DeleteDroneByIdUseCase,
  ) {}

  @Get()
  @Transactional()
  @ApiOperation({ operationId: 'getDrones', summary: 'Get all drones' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Drones retrieved successfully.', type: [DroneResponseDto] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async getAll(@Query() queryDto: DroneQueryDto) {
    const query = StrictBuilder<GetAllDronesQuery>()
      .search(queryDto.search)
      .sort(queryDto.sort)
      .order(queryDto.order)
      .page(queryDto.page)
      .limit(queryDto.limit)
      .build();
    return this.getAllDronesUseCase.execute(query);
  }

  @Get(':id')
  @Transactional()
  @ApiOperation({ operationId: 'getDrone', summary: 'Get a drone by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Drone retrieved successfully.', type: DroneResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Drone not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the drone' })
  async getById(@Param('id', ParseUUIDPipe) id: DroneId) {
    return this.getDroneByIdUseCase.execute(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @Transactional()
  @ApiOperation({ operationId: 'createDrone', summary: 'Create a drone' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Drone created successfully.', type: DroneResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid drone data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async create(@Body() createDroneDto: CreateDroneDto) {
    const drone = Builder<IDrone>()
      .company(createDroneDto.company)
      .model(createDroneDto.model)
      .fullName(createDroneDto.fullName)
      .priceRTF(createDroneDto.priceRTF)
      .tankCapacity(createDroneDto.tankCapacity)
      .flightSpeed(createDroneDto.flightSpeed)
      .sprayWidth(createDroneDto.sprayWidth)
      .coveragePerDay(createDroneDto.coveragePerDay)
      .rtfEquipment((createDroneDto.rtfEquipment ?? '') as DroneRtfEquipment)
      .build();
    return this.createDroneUseCase.execute(drone);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @Transactional()
  @ApiOperation({ operationId: 'updateDrone', summary: 'Update a drone' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Drone updated successfully.', type: DroneResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Drone not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid drone data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the drone' })
  async update(@Param('id', ParseUUIDPipe) id: DroneId, @Body() updateDroneDto: UpdateDroneDto) {
    const drone = Builder<Drone>()
      .uuid(id)
      .company(updateDroneDto.company as DroneCompany)
      .model(updateDroneDto.model as DroneModel)
      .fullName(updateDroneDto.fullName as DroneFullName)
      .priceRTF(updateDroneDto.priceRTF as DronePriceRTF)
      .tankCapacity(updateDroneDto.tankCapacity as DroneTankCapacity)
      .flightSpeed(updateDroneDto.flightSpeed as DroneFlightSpeed)
      .sprayWidth(updateDroneDto.sprayWidth as DroneSprayWidth)
      .coveragePerDay(updateDroneDto.coveragePerDay as DroneCoveragePerDay)
      .rtfEquipment(updateDroneDto.rtfEquipment as DroneRtfEquipment)
      .build();
    return this.updateDroneByIdUseCase.execute(drone);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Transactional()
  @ApiOperation({ operationId: 'deleteDrone', summary: 'Delete a drone' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Drone deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Drone not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the drone' })
  async delete(@Param('id', ParseUUIDPipe) id: DroneId) {
    await this.deleteDroneByIdUseCase.execute(id);
  }
}
