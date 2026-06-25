import { decimal, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const drones = pgTable(
  'drones',
  {
    uuid: uuid('uuid').defaultRandom().primaryKey(),
    company: varchar('company', { length: 100 }).notNull(),
    model: varchar('model', { length: 100 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    priceRTF: decimal('price_rtf', { precision: 12, scale: 2 }).notNull(),
    tankCapacity: decimal('tank_capacity', { precision: 8, scale: 2 }).notNull(),
    flightSpeed: decimal('flight_speed', { precision: 8, scale: 2 }).notNull(),
    sprayWidth: decimal('spray_width', { precision: 8, scale: 2 }).notNull(),
    coveragePerDay: decimal('coverage_per_day', { precision: 10, scale: 2 }).notNull(),
    rtfEquipment: text('rtf_equipment').default('').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  (table) => ({
    companyIdx: index('IDX_DRONES_COMPANY').on(table.company),
    modelIdx: index('IDX_DRONES_MODEL').on(table.model),
  }),
);
