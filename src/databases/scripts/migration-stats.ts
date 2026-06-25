#!/usr/bin/env ts-node

import 'dotenv/config';
import { Pool } from 'pg';

async function showMigrationStats() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  });

  try {
    console.log('Loading migration statistics...\n');

    const { rows } = await pool.query(`
      SELECT
        COUNT(*) as total_executions,
        COUNT(*) FILTER (WHERE success = true) as successful_executions,
        COUNT(*) FILTER (WHERE success = false) as failed_executions,
        ROUND(AVG(execution_time))::int as avg_execution_time,
        MAX(execution_time) as max_execution_time,
        MIN(executed_at) as first_migration,
        MAX(executed_at) as last_migration
      FROM migrations_history
    `);

    if (rows.length > 0 && rows[0].total_executions > 0) {
      const s = rows[0];
      console.log('Total executions: ' + s.total_executions);
      console.log('Successful: ' + s.successful_executions);
      console.log('Failed: ' + s.failed_executions);
      console.log('Average execution time: ' + s.avg_execution_time + 'ms');
      console.log('Max execution time: ' + s.max_execution_time + 'ms');
      console.log('First migration: ' + new Date(s.first_migration).toLocaleString());
      console.log('Last migration: ' + new Date(s.last_migration).toLocaleString());
    } else {
      console.log('No migration statistics available.');
    }
  } catch {
    console.log('No migration statistics available.');
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  showMigrationStats();
}
