import { Brand, CreatedAt, UpdatedAt } from 'src/types/utility.type';

export type DroneId = Brand<string, 'DroneId'>;
export type DroneCompany = Brand<string, 'DroneCompany'>;
export type DroneModel = Brand<string, 'DroneModel'>;
export type DroneFullName = Brand<string, 'DroneFullName'>;
export type DronePriceRTF = Brand<number, 'DronePriceRTF'>;
export type DroneTankCapacity = Brand<number, 'DroneTankCapacity'>;
export type DroneFlightSpeed = Brand<number, 'DroneFlightSpeed'>;
export type DroneSprayWidth = Brand<number, 'DroneSprayWidth'>;
export type DroneCoveragePerDay = Brand<number, 'DroneCoveragePerDay'>;
export type DroneRtfEquipment = Brand<string, 'DroneRtfEquipment'>;
export type DroneCreatedAt = Brand<CreatedAt, 'DroneCreatedAt'>;
export type DroneUpdatedAt = Brand<UpdatedAt, 'DroneUpdatedAt'>;

export interface IDrone {
  uuid: DroneId;
  company: DroneCompany;
  model: DroneModel;
  fullName: DroneFullName;
  priceRTF: DronePriceRTF;
  tankCapacity: DroneTankCapacity;
  flightSpeed: DroneFlightSpeed;
  sprayWidth: DroneSprayWidth;
  coveragePerDay: DroneCoveragePerDay;
  rtfEquipment: DroneRtfEquipment;
  createdAt?: DroneCreatedAt;
  updatedAt?: DroneUpdatedAt;
}

export class Drone implements IDrone {
  uuid: DroneId;
  company: DroneCompany;
  model: DroneModel;
  fullName: DroneFullName;
  priceRTF: DronePriceRTF;
  tankCapacity: DroneTankCapacity;
  flightSpeed: DroneFlightSpeed;
  sprayWidth: DroneSprayWidth;
  coveragePerDay: DroneCoveragePerDay;
  rtfEquipment: DroneRtfEquipment;
  createdAt?: DroneCreatedAt;
  updatedAt?: DroneUpdatedAt;
}
