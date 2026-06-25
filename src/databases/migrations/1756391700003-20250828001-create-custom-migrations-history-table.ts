import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { CustomMigrationTable } from '../custom-migration-table';

export class CreateCustomMigrationsHistoryTable1756391900903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing standard migrations_history table if it exists
    await queryRunner.dropTable('migrations_history', true);

    // Create custom migrations_history table with enhanced tracking
    const migrationTable = CustomMigrationTable.createMigrationsTable();
    await queryRunner.createTable(migrationTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop custom migrations_history table
    await queryRunner.dropTable('migrations_history', true);

    // Recreate standard TypeORM migrations table
    await queryRunner.createTable(
      new Table({
        name: 'migrations_history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'timestamp',
            type: 'bigint',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }
}
