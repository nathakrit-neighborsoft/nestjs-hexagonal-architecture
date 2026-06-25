import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { DroneId, IDrone } from '../domains/drone.domain';
import { DroneRepository } from '../ports/drone.repository';
import { UpdateDroneByIdUseCase } from './updateDroneById.usecase';

describe('UpdateDroneByIdUseCase', () => {
  let useCase: UpdateDroneByIdUseCase;
  const droneRepository = mock<DroneRepository>();

  beforeEach(() => { useCase = new UpdateDroneByIdUseCase(droneRepository); });
  afterEach(() => { vi.resetAllMocks(); });

  const droneId = faker.string.uuid() as DroneId;

  it('should be throw error when drone not found', async () => {
    // Arrange
    const command = mock<IDrone>({ uuid: droneId });
    const errorExpected = new NotFoundException('Drone not found');
    droneRepository.getById.mockResolvedValue(undefined);

    // Act
    const promise = useCase.execute(command);

    // Assert
    await expect(promise).rejects.toThrow(errorExpected);
    expect(droneRepository.getById).toHaveBeenCalledWith(droneId);
    expect(droneRepository.updateById).not.toHaveBeenCalled();
  });

  it('should be update drone', async () => {
    // Arrange
    const drone = mock<IDrone>({ uuid: droneId });
    const command = Builder<IDrone>().uuid(droneId).build();
    droneRepository.getById.mockResolvedValue(drone);
    droneRepository.updateById.mockResolvedValue(drone);

    // Act
    const actual = await useCase.execute(command);

    // Assert
    expect(actual).toEqual(drone);
    expect(droneRepository.getById).toHaveBeenCalledWith(droneId);
    expect(droneRepository.updateById).toHaveBeenCalledWith(command);
  });
});
