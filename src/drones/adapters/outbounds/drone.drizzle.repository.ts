import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';
import { Builder, StrictBuilder } from 'builder-pattern';
import { GetAllMetaType } from 'src/types/utility.type';
import { drones } from 'src/databases/schemas';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/databases/schemas';
import type { SQL } from 'drizzle-orm';
import {
  Drone,
  DroneCompany,
  DroneCoveragePerDay,
  DroneCreatedAt,
  DroneFlightSpeed,
  DroneFullName,
  DroneId,
  DroneModel,
  DronePriceRTF,
  DroneRtfEquipment,
  DroneSprayWidth,
  DroneTankCapacity,
  DroneUpdatedAt,
  IDrone,
} from '../../applications/domains/drone.domain';
import {
  DroneRepository,
  GetAllDronesQuery,
  GetAllDronesReturnType,
} from '../../applications/ports/drone.repository';

type DrizzleDB = NodePgDatabase<typeof schema>;

@Injectable()
export class DroneDrizzleRepository implements DroneRepository {
  constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm<DrizzleDB>>) {}

  async create(drone: IDrone): Promise<IDrone> {
    const [result] = await this.model.tx
      .insert(drones)
      .values({
        company: drone.company,
        model: drone.model,
        fullName: drone.fullName,
        priceRTF: drone.priceRTF.toString(),
        tankCapacity: drone.tankCapacity.toString(),
        flightSpeed: drone.flightSpeed.toString(),
        sprayWidth: drone.sprayWidth.toString(),
        coveragePerDay: drone.coveragePerDay.toString(),
        rtfEquipment: drone.rtfEquipment,
      })
      .returning();
    return DroneDrizzleRepository.toDomain(result);
  }

  async getAll(params: GetAllDronesQuery): Promise<GetAllDronesReturnType> {
    const { search, sort, order, page, limit } = params;
    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const conditions: (SQL | undefined)[] = [];

    if (search) {
      conditions.push(
        or(
          ilike(drones.company, `%${search}%`),
          ilike(drones.model, `%${search}%`),
          ilike(drones.fullName, `%${search}%`),
        )!,
      );
    }

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean) as SQL[]) : undefined;

    const [{ count: total }] = await this.model.tx
      .select({ count: count() })
      .from(drones)
      .where(where!);

    const orderByClause =
      sort && ['company', 'model', 'fullName', 'priceRTF', 'createdAt'].includes(sort)
        ? order === 'ASC'
          ? asc((drones as any)[sort])
          : desc((drones as any)[sort])
        : desc(drones.createdAt);

    const effectiveLimit = currentLimit === -1 ? 999999 : currentLimit;
    const effectiveOffset = currentLimit === -1 ? 0 : (currentPage - 1) * currentLimit;
    const rows = await this.model.tx
      .select()
      .from(drones)
      .where(where!)
      .orderBy(orderByClause)
      .limit(effectiveLimit)
      .offset(effectiveOffset);

    const result = rows.map(DroneDrizzleRepository.toDomain);
    const totalPages = currentLimit === -1 ? 1 : Math.ceil(Number(total) / currentLimit);

    return StrictBuilder<GetAllDronesReturnType>()
      .result(result)
      .meta(
        StrictBuilder<GetAllMetaType>()
          .page(currentPage)
          .limit(currentLimit)
          .total(Number(total))
          .totalPages(totalPages)
          .build(),
      )
      .build();
  }

  async getById(id: DroneId): Promise<IDrone | undefined> {
    const [result] = await this.model.tx
      .select()
      .from(drones)
      .where(eq(drones.uuid, id))
      .limit(1);
    return result ? DroneDrizzleRepository.toDomain(result) : undefined;
  }

  async updateById(drone: IDrone): Promise<IDrone> {
    const [result] = await this.model.tx
      .update(drones)
      .set({
        company: drone.company,
        model: drone.model,
        fullName: drone.fullName,
        priceRTF: drone.priceRTF.toString(),
        tankCapacity: drone.tankCapacity.toString(),
        flightSpeed: drone.flightSpeed.toString(),
        sprayWidth: drone.sprayWidth.toString(),
        coveragePerDay: drone.coveragePerDay.toString(),
        rtfEquipment: drone.rtfEquipment,
      })
      .where(eq(drones.uuid, drone.uuid))
      .returning();
    return DroneDrizzleRepository.toDomain(result);
  }

  async deleteById(id: DroneId): Promise<void> {
    await this.model.tx.delete(drones).where(eq(drones.uuid, id));
  }

  static toDomain(row: typeof drones.$inferSelect): IDrone {
    return Builder(Drone)
      .uuid(row.uuid as DroneId)
      .company(row.company as DroneCompany)
      .model(row.model as DroneModel)
      .fullName(row.fullName as DroneFullName)
      .priceRTF(Number(row.priceRTF) as DronePriceRTF)
      .tankCapacity(Number(row.tankCapacity) as DroneTankCapacity)
      .flightSpeed(Number(row.flightSpeed) as DroneFlightSpeed)
      .sprayWidth(Number(row.sprayWidth) as DroneSprayWidth)
      .coveragePerDay(Number(row.coveragePerDay) as DroneCoveragePerDay)
      .rtfEquipment((row.rtfEquipment ?? '') as DroneRtfEquipment)
      .createdAt(row.createdAt as DroneCreatedAt)
      .updatedAt(row.updatedAt as DroneUpdatedAt)
      .build();
  }
}
