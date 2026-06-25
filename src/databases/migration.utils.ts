import { DataSource } from 'typeorm';
import { typeOrmDatabaseConfig } from '../configs/typeorm.config';

/**
 * Interface for migration history record from database
 */
interface MigrationHistoryRecord {
  name: string;
  executed_at: Date;
  execution_time: number;
  success: boolean;
  error_message?: string;
}

/**
 * Interface for migration execution result
 */
interface MigrationResult {
  timestamp: number;
  name: string;
}

/**
 * Enhanced migration utilities with timestamp tracking
 */
export class MigrationUtils {
  private static dataSource: DataSource;

  /**
   * Get or create data source instance
   */
  static async getDataSource(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = new DataSource(typeOrmDatabaseConfig);

      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
    }

    return this.dataSource;
  }

  /**
   * Run all pending migrations with enhanced tracking
   */
  static async runMigrations(): Promise<void> {
    const dataSource = await this.getDataSource();
    const startTime = Date.now();

    try {
      const migrations = await dataSource.runMigrations({ transaction: 'all' });
      const executionTime = Date.now() - startTime;

      console.log('✅ All migrations have been executed successfully');
      console.log(`🕒 Execution time: ${executionTime}ms`);
      console.log(`📊 Total migrations executed: ${migrations.length}`);

      // Log execution details to custom table
      if (migrations.length > 0) {
        await this.logMigrationExecution(migrations, executionTime, true);
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('❌ Migration execution failed:', error);

      // Log failure to custom table
      await this.logMigrationExecution([], executionTime, false, error.message);
      throw error;
    }
  }

  /**
   * Revert last migration
   */
  static async revertLastMigration(): Promise<void> {
    const dataSource = await this.getDataSource();
    await dataSource.undoLastMigration({ transaction: 'all' });
    console.log('✅ Last migration has been reverted successfully');
  }

  /**
   * Show detailed migration status with history
   */
  static async showMigrations(): Promise<void> {
    const dataSource = await this.getDataSource();
    const hasPending = await dataSource.showMigrations();

    if (hasPending) {
      console.log('📋 Pending migrations found');
    } else {
      console.log('✅ No pending migrations');
    }

    // Show migration history from custom table
    try {
      const historyExists = await dataSource.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'migrations_history')",
      );

      if (historyExists[0].exists) {
        console.log('\n📜 Migration History:');
        const history = await dataSource.query(`
          SELECT name, executed_at, execution_time, success, error_message 
          FROM migrations_history 
          ORDER BY executed_at DESC 
          LIMIT 10
        `);

        history.forEach((record: MigrationHistoryRecord, index: number) => {
          const status = record.success ? '✅' : '❌';
          const time = record.execution_time ? `${record.execution_time}ms` : 'N/A';
          const date = new Date(record.executed_at).toLocaleString();
          console.log(`${index + 1}. ${status} ${record.name} - ${date} (${time})`);
          if (!record.success && record.error_message) {
            console.log(`   Error: ${record.error_message}`);
          }
        });
      }
    } catch {
      console.log('ℹ️  Migration history not available yet');
    }
  }

  /**
   * Drop all tables and recreate them
   */
  static async resetDatabase(): Promise<void> {
    const dataSource = await this.getDataSource();

    console.log('🗑️  Dropping database schema...');
    await dataSource.dropDatabase();

    console.log('🔄 Recreating database schema...');
    await dataSource.synchronize();

    console.log('📦 Running migrations...');
    await dataSource.runMigrations({ transaction: 'all' });

    console.log('✅ Database has been reset successfully');
  }

  /**
   * Log migration execution details to custom history table
   */
  private static async logMigrationExecution(
    migrations: MigrationResult[],
    executionTime: number,
    success: boolean,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const dataSource = await this.getDataSource();

      // Check if custom migrations_history table exists
      const tableExists = await dataSource.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'migrations_history')",
      );

      if (!tableExists[0].exists) {
        return; // Skip logging if table doesn't exist yet
      }

      if (migrations.length > 0) {
        // Log each migration
        for (const migration of migrations) {
          await dataSource.query(
            `
            INSERT INTO migrations_history (timestamp, name, execution_time, success, error_message, executed_at) 
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
          `,
            [migration.timestamp, migration.name, executionTime, success, errorMessage],
          );
        }
      } else if (!success) {
        // Log failed execution
        await dataSource.query(
          `
          INSERT INTO migrations_history (timestamp, name, execution_time, success, error_message, executed_at) 
          VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        `,
          [Date.now(), 'Migration Execution Failed', executionTime, success, errorMessage],
        );
      }
    } catch (error) {
      console.warn('⚠️  Could not log to migration history:', error.message);
    }
  }

  /**
   * Get migration statistics
   */
  static async getMigrationStats(): Promise<void> {
    try {
      const dataSource = await this.getDataSource();

      const stats = await dataSource.query(`
        SELECT 
          COUNT(*) as total_executions,
          COUNT(*) FILTER (WHERE success = true) as successful_executions,
          COUNT(*) FILTER (WHERE success = false) as failed_executions,
          AVG(execution_time) as avg_execution_time,
          MAX(execution_time) as max_execution_time,
          MIN(executed_at) as first_migration,
          MAX(executed_at) as last_migration
        FROM migrations_history
      `);

      if (stats.length > 0) {
        const stat = stats[0];
        console.log('\n📊 Migration Statistics:');
        console.log(`   Total executions: ${stat.total_executions}`);
        console.log(`   Successful: ${stat.successful_executions}`);
        console.log(`   Failed: ${stat.failed_executions}`);
        console.log(`   Average execution time: ${Math.round(stat.avg_execution_time)}ms`);
        console.log(`   Max execution time: ${stat.max_execution_time}ms`);
        console.log(`   First migration: ${new Date(stat.first_migration).toLocaleString()}`);
        console.log(`   Last migration: ${new Date(stat.last_migration).toLocaleString()}`);
      }
    } catch {
      console.log('ℹ️  Migration statistics not available');
    }
  }

  /**
   * Close data source connection
   */
  static async closeConnection(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log('🔐 Database connection closed');
    }
  }
}
