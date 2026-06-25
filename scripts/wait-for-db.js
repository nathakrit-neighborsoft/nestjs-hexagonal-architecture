#!/usr/bin/env node

/**
 * Database connection check script
 * Waits for PostgreSQL to be ready before proceeding
 */

const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_DATABASE || 'expense_tracker',
  connectionTimeoutMillis: 5000,
  query_timeout: 5000,
};

async function waitForDatabase() {
  console.log('⏳ Waiting for database connection...');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);

  let attempts = 0;
  const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const client = new Client(config);
      await client.connect();

      // Test the connection with a simple query
      const result = await client.query('SELECT NOW() as current_time');
      await client.end();

      console.log('✅ Database connection successful!');
      console.log(`   Current time: ${result.rows[0].current_time}`);
      return true;
    } catch (error) {
      console.log(`❌ Attempt ${attempts}/${maxAttempts}: Database not ready yet...`);
      console.log(`   Error: ${error.message}`);

      if (attempts >= maxAttempts) {
        console.error('❌ Failed to connect to database after maximum attempts');
        process.exit(1);
      }

      // Wait 2 seconds before next attempt
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

// Run the check
waitForDatabase().catch((error) => {
  console.error('❌ Database connection check failed:', error);
  process.exit(1);
});
