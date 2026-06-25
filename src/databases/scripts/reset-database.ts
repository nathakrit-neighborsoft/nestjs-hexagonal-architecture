#!/usr/bin/env ts-node

/**
 * Script to reset the database completely
 * Usage: npm run db:reset
 */

import 'dotenv/config';
import { MigrationUtils } from '../migration.utils';

async function resetDatabase() {
  try {
    console.log('🚀 Starting database reset...');

    await MigrationUtils.resetDatabase();

    console.log('🎉 Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    process.exit(1);
  } finally {
    await MigrationUtils.closeConnection();
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  resetDatabase();
}
