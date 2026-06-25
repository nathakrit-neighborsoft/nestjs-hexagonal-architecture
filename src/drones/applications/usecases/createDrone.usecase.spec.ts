import { faker } from '@faker-js/faker';
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  DroneId, DroneCompany, DroneModel, DroneFullName,
  DronePriceRTF, DroneTankCapacity, DroneFlightSpeed,
  DroneSprayWidth, DroneCoveragePerDay, DroneRtfEquipment,
  DroneCreatedAt, DroneUpdatedAt, IDrone,
} from '../domains/drone.domain';
import { DroneRepository } from '../ports/drone.repository';
import { CreateDroneUseCase } from './createDrone.usecase';

describe('CreateDroneUseCase', () => {
  let useCase: CreateDroneUseCase;
  const droneRepository = mock<DroneRepository>();

  beforeEach(() => { useCase = new CreateDroneUseCase(droneRepository); });
  afterEach(() => { vi.resetAllMocks(); });

  const droneId = faker.string.uuid() as DroneId;
  const droneData = Builder<IDrone>()
    .uuid(droneId)
    .company(faker.company.name() as DroneCompany)
    .model(faker.vehicle.model() as DroneModel)
    .fullName(faker.commerce.productName() as DroneFullName)
    .priceRTF(faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }) as DronePriceRTF)
    .tankCapacity(faker.number.float({ min: 0, max: 100, fractionDigits: 2 }) as DroneTankCapacity)
    .flightSpeed(faker.number.float({ min: 0, max: 20, fractionDigits: 2 }) as DroneFlightSpeed)
    .sprayWidth(faker.number.float({ min: 0, max: 20, fractionDigits: 2 }) as DroneSprayWidth)
    .coveragePerDay(faker.number.float({ min: 0, max: 100, fractionDigits: 2 }) as DroneCoveragePerDay)
    .rtfEquipment(faker.lorem.sentence() as DroneRtfEquipment)
    .createdAt(new Date() as DroneCreatedAt)
    .updatedAt(new Date() as DroneUpdatedAt)
    .build();

  it('should create drone successfully', async () => {
    // Arrange
    droneRepository.create.mockResolvedValue(droneData);

    // Act
    const actual = await useCase.execute(droneData);

    // Assert
    expect(actual).toEqual(droneData);
    expect(droneRepository.create).toHaveBeenCalledWith(droneData);
    expect(droneRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when creating drone', async () => {
    // Arrange
    const expectedError = new Error('Database connection failed');
    droneRepository.create.mockRejectedValue(expectedError);

    // Act
    const promise = useCase.execute(droneData);

    // Assert
    await expect(promise).rejects.toThrow(expectedError);
    expect(droneRepository.create).toHaveBeenCalledWith(droneData);
  });
});
