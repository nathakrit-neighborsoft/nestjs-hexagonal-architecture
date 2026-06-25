import { faker } from '@faker-js/faker';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  DroneId, DroneCompany, DroneModel, DroneFullName,
  DronePriceRTF, DroneTankCapacity, DroneFlightSpeed,
  DroneSprayWidth, DroneCoveragePerDay, DroneRtfEquipment,
  IDrone,
} from '../domains/drone.domain';
import { DroneRepository, GetAllDronesQuery, GetAllDronesReturnType } from '../ports/drone.repository';
import { GetAllDronesUseCase } from './getAllDrones.usecase';

describe('GetAllDronesUseCase', () => {
  let useCase: GetAllDronesUseCase;
  const droneRepository = mock<DroneRepository>();

  beforeEach(() => { useCase = new GetAllDronesUseCase(droneRepository); });
  afterEach(() => { vi.resetAllMocks(); });

  const droneId = faker.string.uuid() as DroneId;

  const mockDrone = Builder<IDrone>()
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
    .build();

  const mockMeta = StrictBuilder<GetAllMetaType>().total(1).page(1).limit(10).totalPages(1).build();

  it('should get all drones successfully', async () => {
    // Arrange
    const query = StrictBuilder<GetAllDronesQuery>().page(1).limit(10).build();
    const expectedResult = StrictBuilder<GetAllDronesReturnType>().result([mockDrone]).meta(mockMeta).build();
    droneRepository.getAll.mockResolvedValue(expectedResult);

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expectedResult);
    expect(droneRepository.getAll).toHaveBeenCalledWith(query);
    expect(droneRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository error when getting drones', async () => {
    // Arrange
    const query = StrictBuilder<GetAllDronesQuery>().page(1).limit(10).build();
    const errorMessage = 'Database connection failed';
    const expectedError = new Error(errorMessage);
    droneRepository.getAll.mockRejectedValue(expectedError);

    // Act
    const promise = useCase.execute(query);

    // Assert
    await expect(promise).rejects.toThrow(expectedError);
    expect(droneRepository.getAll).toHaveBeenCalledWith(query);
    expect(droneRepository.getAll).toHaveBeenCalledTimes(1);
  });
});
