import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type IDrone } from '../domains/drone.domain';
import type { DroneRepository } from '../ports/drone.repository';
import { droneRepositoryToken } from '../ports/drone.repository';

@Injectable()
export class UpdateDroneByIdUseCase {
  constructor(
    @Inject(droneRepositoryToken)
    private readonly droneRepository: DroneRepository,
  ) {}

  async execute(drone: IDrone): Promise<IDrone> {
    const existingDrone = await this.droneRepository.getById(drone.uuid);
    if (!existingDrone) throw new NotFoundException('Drone not found');
    return this.droneRepository.updateById(drone);
  }
}
