import { GetAllParamsType, GetAllMetaType } from 'src/types/utility.type';
import type { DroneId, IDrone } from '../domains/drone.domain';

export type UpdateDroneCommand = Partial<Omit<IDrone, 'uuid' | 'createdAt' | 'updatedAt'>>;

export interface GetAllDronesQuery extends GetAllParamsType {}

export interface GetAllDronesReturnType {
  result: IDrone[];
  meta: GetAllMetaType;
}

const droneRepositoryTokenSymbol: unique symbol = Symbol('DroneRepository');
export const droneRepositoryToken = droneRepositoryTokenSymbol.toString();

export interface DroneRepository {
  create(drone: IDrone): Promise<IDrone>;
  getAll(query: GetAllDronesQuery): Promise<GetAllDronesReturnType>;
  getById(id: DroneId): Promise<IDrone | undefined>;
  updateById(drone: IDrone): Promise<IDrone>;
  deleteById(id: DroneId): Promise<void>;
}
