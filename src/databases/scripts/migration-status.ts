#!/usr/bin/env ts-node

import 'dotenv/config';
import { Pool } from 'pg';

async function checkMigrationStatus() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm',
  });

  try {
    console.log('Checking migration status...\n');

    const { rows } = await pool.query(`
      SELECT name, executed_at, execution_time, success, error_message
      FROM migrations_history
      ORDER BY executed_at DESC
      LIMIT 10
    `);

    if (rows.length === 0) {
      console.log('No migration history found.');
      return;
    }

    rows.forEach((row: any, i: number) => {
      const status = row.success ? '\u2705' : '\u274c';
      const time = row.execution_time ? `${row.execution_time}ms` : 'N/A';
      const date = new Date(row.executed_at).toLocaleString();
      console.log(`${i + 1}. ${status} ${row.name} - ${date} (${time})`);
      if (!row.success && row.error_message) {
        console.log(`   Error: ${row.error_message}`);
      }
    });
  } catch (error) {
    console.error('Error checking migration status:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  checkMigrationStatus();
}
