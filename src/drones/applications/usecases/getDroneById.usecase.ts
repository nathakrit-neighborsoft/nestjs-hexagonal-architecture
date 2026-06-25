import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DroneId, IDrone } from '../domains/drone.domain';
import type { DroneRepository } from '../ports/drone.repository';
import { droneRepositoryToken } from '../ports/drone.repository';

@Injectable()
export class GetDroneByIdUseCase {
  constructor(
    @Inject(droneRepositoryToken)
    private readonly droneRepository: DroneRepository,
  ) {}

  async execute(id: DroneId): Promise<IDrone> {
    const drone = await this.droneRepository.getById(id);
    if (!drone) throw new NotFoundException('Drone not found');
    return drone;
  }
}
