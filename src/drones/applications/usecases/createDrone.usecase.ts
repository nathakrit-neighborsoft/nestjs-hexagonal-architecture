import { Inject, Injectable } from '@nestjs/common';
import { type IDrone } from '../domains/drone.domain';
import type { DroneRepository } from '../ports/drone.repository';
import { droneRepositoryToken } from '../ports/drone.repository';

@Injectable()
export class CreateDroneUseCase {
  constructor(
    @Inject(droneRepositoryToken)
    private readonly droneRepository: DroneRepository,
  ) {}

  async execute(drone: IDrone): Promise<IDrone> {
    return this.droneRepository.create(drone);
  }
}
