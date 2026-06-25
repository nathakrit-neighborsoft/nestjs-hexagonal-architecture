import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DroneId } from '../domains/drone.domain';
import type { DroneRepository } from '../ports/drone.repository';
import { droneRepositoryToken } from '../ports/drone.repository';

@Injectable()
export class DeleteDroneByIdUseCase {
  constructor(
    @Inject(droneRepositoryToken)
    private readonly droneRepository: DroneRepository,
  ) {}

  async execute(id: DroneId): Promise<void> {
    const drone = await this.droneRepository.getById(id);
    if (!drone) throw new NotFoundException('Drone not found');
    await this.droneRepository.deleteById(id);
  }
}
