#!/usr/bin/env ts-node

/**
 * Script to check migration status
 * Usage: npm run db:status
 */

import 'dotenv/config';
import { MigrationUtils } from '../migration.utils';

async function checkMigrationStatus() {
  try {
    console.log('📊 Checking migration status...');

    await MigrationUtils.showMigrations();
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    process.exit(1);
  } finally {
    await MigrationUtils.closeConnection();
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  checkMigrationStatus();
}
