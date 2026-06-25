import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DroneController } from './adapters/inbounds/drone.controller';
import { DroneDrizzleRepository } from './adapters/outbounds/drone.drizzle.repository';
import { droneRepositoryToken } from './applications/ports/drone.repository';
import { CreateDroneUseCase } from './applications/usecases/createDrone.usecase';
import { DeleteDroneByIdUseCase } from './applications/usecases/deleteDroneById.usecase';
import { GetAllDronesUseCase } from './applications/usecases/getAllDrones.usecase';
import { GetDroneByIdUseCase } from './applications/usecases/getDroneById.usecase';
import { UpdateDroneByIdUseCase } from './applications/usecases/updateDroneById.usecase';

@Module({
  imports: [AuthModule],
  controllers: [DroneController],
  providers: [
    { provide: droneRepositoryToken, useClass: DroneDrizzleRepository },
    CreateDroneUseCase,
    DeleteDroneByIdUseCase,
    GetAllDronesUseCase,
    GetDroneByIdUseCase,
    UpdateDroneByIdUseCase,
  ],
})
export class DronesModule {}
