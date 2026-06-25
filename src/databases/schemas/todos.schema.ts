import { boolean, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { drones } from './drones.schema';
import { user } from './auth.schema';

export const todos = pgTable(
  'todos',
  {
    uuid: uuid('uuid').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    droneId: uuid('drone_id').references(() => drones.uuid, { onDelete: 'set null', onUpdate: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').default('').notNull(),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('IDX_TODOS_USER_ID').on(table.userId),
    userDroneIdx: index('IDX_TODOS_USER_DRONE').on(table.userId, table.droneId),
  }),
);
