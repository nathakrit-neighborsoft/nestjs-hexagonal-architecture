import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../schemas';
import { migrationsHistory } from '../schemas';

const MIGRATIONS_FOLDER = __dirname + '/migrations';

export async function runMigrations() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  });

  const db = drizzle(pool, { schema });
  const startTime = Date.now();

  try {
    console.log('Running drizzle migrations...');
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

    const elapsed = Date.now() - startTime;
    await db.insert(migrationsHistory).values({
      timestamp: startTime,
      name: 'drizzle-migrate',
      executionTime: elapsed,
      success: true,
    });

    console.log(`All migrations executed. Time: ${elapsed}ms`);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    await db.insert(migrationsHistory).values({
      timestamp: startTime,
      name: 'drizzle-migrate',
      executionTime: elapsed,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
