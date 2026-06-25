import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateExpensesTable1756391900902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'expenses',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create Foreign Key relationship with users table
    await queryRunner.createForeignKey(
      'expenses',
      new TableForeignKey({
        name: 'FK_EXPENSES_USER_ID',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['uuid'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_USER_ID',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_USER_CATEGORY',
        columnNames: ['user_id', 'category'],
      }),
    );
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_USER_DATE',
        columnNames: ['user_id', 'date'],
      }),
    );
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_USER_CATEGORY_DATE',
        columnNames: ['user_id', 'category', 'date'],
      }),
    );
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_DATE',
        columnNames: ['date'],
      }),
    );
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_CATEGORY',
        columnNames: ['category'],
      }),
    );
    await queryRunner.createIndex(
      'expenses',
      new TableIndex({
        name: 'IDX_EXPENSES_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_USER_ID');
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_USER_CATEGORY');
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_USER_DATE');
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_USER_CATEGORY_DATE');
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_DATE');
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_CATEGORY');
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_CREATED_AT');

    // Drop Foreign Key
    await queryRunner.dropForeignKey('expenses', 'FK_EXPENSES_USER_ID');

    // Drop table
    await queryRunner.dropTable('expenses');
  }
}
