import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { DroneId, IDrone } from '../domains/drone.domain';
import { DroneRepository } from '../ports/drone.repository';
import { GetDroneByIdUseCase } from './getDroneById.usecase';

describe('GetDroneByIdUseCase', () => {
  let useCase: GetDroneByIdUseCase;
  const droneRepository = mock<DroneRepository>();

  beforeEach(() => { useCase = new GetDroneByIdUseCase(droneRepository); });
  afterEach(() => { vi.resetAllMocks(); });

  const droneId = faker.string.uuid() as DroneId;

  it('should be throw error when drone not found', async () => {
    // Arrange
    droneRepository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('Drone not found');

    // Act
    const promise = useCase.execute(droneId);

    // Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect(droneRepository.getById).toHaveBeenCalledWith(droneId);
  });

  it('should be get drone by id', async () => {
    // Arrange
    const drone = mock<IDrone>({ uuid: droneId });
    droneRepository.getById.mockResolvedValue(drone);

    // Act
    const actual = await useCase.execute(droneId);

    // Assert
    expect(actual).toEqual(drone);
    expect(droneRepository.getById).toHaveBeenCalledWith(droneId);
  });
});
