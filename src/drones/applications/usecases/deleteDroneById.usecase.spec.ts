import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { DroneId, IDrone } from '../domains/drone.domain';
import { DroneRepository } from '../ports/drone.repository';
import { DeleteDroneByIdUseCase } from './deleteDroneById.usecase';

describe('DeleteDroneByIdUseCase', () => {
  let useCase: DeleteDroneByIdUseCase;
  const droneRepository = mock<DroneRepository>();

  beforeEach(() => { useCase = new DeleteDroneByIdUseCase(droneRepository); });
  afterEach(() => { vi.resetAllMocks(); });

  const droneId = faker.string.uuid() as DroneId;

  it('should be throw error when drone not found', async () => {
    // Arrange
    const errorExpected = new NotFoundException('Drone not found');
    droneRepository.getById.mockResolvedValue(undefined);

    // Act
    const promise = useCase.execute(droneId);

    // Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect(droneRepository.getById).toHaveBeenCalledWith(droneId);
    expect(droneRepository.deleteById).not.toHaveBeenCalled();
  });

  it('should be delete drone', async () => {
    // Arrange
    droneRepository.getById.mockResolvedValue(mock<IDrone>({ uuid: droneId }));
    droneRepository.deleteById.mockResolvedValue(undefined);

    // Act
    const actual = await useCase.execute(droneId);

    // Assert
    expect(actual).toBeUndefined();
    expect(droneRepository.getById).toHaveBeenCalledWith(droneId);
    expect(droneRepository.deleteById).toHaveBeenCalledWith(droneId);
  });
});
