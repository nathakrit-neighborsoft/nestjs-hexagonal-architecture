#!/usr/bin/env ts-node

/**
 * Script to show migration statistics
 * Usage: npm run db:stats
 */

import 'dotenv/config';
import { MigrationUtils } from '../migration.utils';

async function showMigrationStats() {
  try {
    console.log('📊 Loading migration statistics...');

    // Show current status
    await MigrationUtils.showMigrations();

    // Show detailed statistics
    await MigrationUtils.getMigrationStats();
  } catch (error) {
    console.error('❌ Error loading migration statistics:', error);
    process.exit(1);
  } finally {
    await MigrationUtils.closeConnection();
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  showMigrationStats();
}
