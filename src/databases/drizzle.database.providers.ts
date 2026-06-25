import { Pool } from 'pg';
import { drizzle as drizzleClient } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

export const DRIZZLE_DB = 'DRIZZLE_DB';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
});

export const drizzleDatabaseProviders = [
  {
    provide: DRIZZLE_DB,
    useFactory: async () => {
      return drizzleClient(pool, { schema });
    },
  },
];
