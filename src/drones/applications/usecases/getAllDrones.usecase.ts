import { Inject, Injectable } from '@nestjs/common';
import type { DroneRepository, GetAllDronesQuery, GetAllDronesReturnType } from '../ports/drone.repository';
import { droneRepositoryToken } from '../ports/drone.repository';

@Injectable()
export class GetAllDronesUseCase {
  constructor(
    @Inject(droneRepositoryToken)
    private readonly droneRepository: DroneRepository,
  ) {}

  async execute(query: GetAllDronesQuery): Promise<GetAllDronesReturnType> {
    return this.droneRepository.getAll(query);
  }
}
