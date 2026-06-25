import { Table, TableColumn } from 'typeorm';

/**
 * Custom migrations history table with enhanced timestamp tracking
 */
export class CustomMigrationTable {
  static createMigrationsTable(): Table {
    return new Table({
      name: 'migrations_history',
      columns: [
        new TableColumn({
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        }),
        new TableColumn({
          name: 'timestamp',
          type: 'bigint',
        }),
        new TableColumn({
          name: 'name',
          type: 'varchar',
        }),
        new TableColumn({
          name: 'executed_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        }),
        new TableColumn({
          name: 'execution_time',
          type: 'int',
          isNullable: true,
          comment: 'Execution time in milliseconds',
        }),
        new TableColumn({
          name: 'success',
          type: 'boolean',
          default: true,
        }),
        new TableColumn({
          name: 'error_message',
          type: 'text',
          isNullable: true,
        }),
        new TableColumn({
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        }),
        new TableColumn({
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP',
        }),
      ],
    });
  }
}
