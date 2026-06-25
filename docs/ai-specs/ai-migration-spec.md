# AI Migration Specification - NestJS Hexagonal Architecture

## Migration Overview

This specification provides standardized templates and guidelines for creating database migrations within the NestJS Hexagonal Architecture project. Migrations should be created based on the Entity structure to ensure database schema consistency.

## Migration Creation Process

### Step 1: Analyze Entity Structure

Before creating a migration, analyze the Entity file to understand:
- Column types and constraints
- Primary key configuration
- Foreign key relationships
- Index requirements
- Nullable fields

### Step 2: Migration Template

#### Migration Template (`{TIMESTAMP}-{DATE}-create-{ENTITY_NAME_LOWERCASE}-table.ts`)

```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Create{ENTITY_NAME}Table{TIMESTAMP} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: '{ENTITY_NAME_LOWERCASE}s',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '1000',
            isNullable: true,
          },
          // Add your additional columns here based on Entity
          // {
          //   name: 'image',
          //   type: 'varchar',
          //   length: '500',
          //   isNullable: true,
          // },
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

    // Create indexes for better performance
    await queryRunner.createIndex(
      '{ENTITY_NAME_LOWERCASE}s',
      new TableIndex({
        name: 'IDX_{ENTITY_NAME_UPPERCASE}S_NAME',
        columnNames: ['name'],
      }),
    );
    await queryRunner.createIndex(
      '{ENTITY_NAME_LOWERCASE}s',
      new TableIndex({
        name: 'IDX_{ENTITY_NAME_UPPERCASE}S_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('{ENTITY_NAME_LOWERCASE}s', 'IDX_{ENTITY_NAME_UPPERCASE}S_NAME');
    await queryRunner.dropIndex('{ENTITY_NAME_LOWERCASE}s', 'IDX_{ENTITY_NAME_UPPERCASE}S_CREATED_AT');

    // Drop table
    await queryRunner.dropTable('{ENTITY_NAME_LOWERCASE}s');
  }
}
```

### Step 3: Migration Commands

#### Create Empty Migration File
```bash
pnpm run migration:create -- --name=Create{ENTITY_NAME}Table
```

#### Run Migration
```bash
pnpm run migration:run
```

#### Generate Migration from Entity Changes (Alternative)
```bash
pnpm run migration:generate -- --name=Create{ENTITY_NAME}Table
```

## Naming Conventions

### File Naming
- **Format**: `{TIMESTAMP}-{DATE}-create-{ENTITY_NAME_LOWERCASE}-table.ts`
- **Example**: `1756391700001-20250828001-create-users-table.ts`

### Class Naming
- **Format**: `Create{ENTITY_NAME}Table{TIMESTAMP}`
- **Example**: `CreateUsersTable1756391900901`

### Table Naming
- **Format**: `{ENTITY_NAME_LOWERCASE}s` (plural)
- **Example**: `users`, `products`, `orders`

## Column Type Mapping

### Entity Decorator to Database Type Mapping

| Entity Decorator | Database Type | Example |
|------------------|---------------|---------|
| `@PrimaryColumn({ type: 'uuid' })` | `uuid` | Primary key with UUID |
| `@Column({ type: 'varchar' })` | `varchar` | Variable length string |
| `@Column({ type: 'float' })` | `float` | Floating point number |
| `@Column({ type: 'int' })` | `integer` | Integer number |
| `@Column({ type: 'boolean' })` | `boolean` | True/false value |
| `@Column({ type: 'text' })` | `text` | Long text content |
| `@Column({ type: 'date' })` | `date` | Date only |
| `@Column({ type: 'timestamp' })` | `timestamp` | Date and time |
| `@CreateDateColumn()` | `timestamp` | Auto-generated creation time |
| `@UpdateDateColumn()` | `timestamp` | Auto-generated update time |

## Common Column Patterns

### UUID Primary Key
```typescript
{
  name: 'uuid',
  type: 'uuid',
  isPrimary: true,
  generationStrategy: 'uuid',
  default: 'gen_random_uuid()',
}
```

### Required String Column
```typescript
{
  name: 'name',
  type: 'varchar',
  length: '255',
  isNullable: false,
}
```

### Optional String Column
```typescript
{
  name: 'description',
  type: 'varchar',
  length: '1000',
  isNullable: true,
}
```

### Numeric Column
```typescript
{
  name: 'price',
  type: 'decimal',
  precision: 10,
  scale: 2,
  isNullable: false,
}
```

### Timestamp Columns
```typescript
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
}
```

## Foreign Key Relationships

### Adding Foreign Key
```typescript
// In the up() method after creating the table
await queryRunner.createForeignKey(
  '{ENTITY_NAME_LOWERCASE}s',
  new TableForeignKey({
    name: 'FK_{ENTITY_NAME_UPPERCASE}_REFERENCED_TABLE',
    columnNames: ['foreign_key_column'],
    referencedTableName: 'referenced_table',
    referencedColumnNames: ['referenced_column'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }),
);
```

### Foreign Key Index
```typescript
await queryRunner.createIndex(
  '{ENTITY_NAME_LOWERCASE}s',
  new TableIndex({
    name: 'IDX_{ENTITY_NAME_UPPERCASE}_FOREIGN_KEY',
    columnNames: ['foreign_key_column'],
  }),
);
```

## Index Creation Guidelines

### Primary Indexes
- Always create indexes on primary keys (automatic)
- Create indexes on foreign keys for better join performance

### Search Indexes
- Create indexes on columns used in WHERE clauses
- Create indexes on columns used in ORDER BY clauses

### Composite Indexes
- Create composite indexes for multi-column queries
- Order columns by selectivity (most selective first)

### Example Indexes
```typescript
// Single column index
await queryRunner.createIndex(
  'table_name',
  new TableIndex({
    name: 'IDX_TABLE_COLUMN',
    columnNames: ['column_name'],
  }),
);

// Composite index
await queryRunner.createIndex(
  'table_name',
  new TableIndex({
    name: 'IDX_TABLE_COL1_COL2',
    columnNames: ['column1', 'column2'],
  }),
);
```

## Migration Best Practices

### 1. Entity-First Approach
- Always create migrations based on Entity definitions
- Ensure column types match Entity decorators
- Maintain consistency between Entity and database schema

### 2. Rollback Safety
- Always implement proper `down()` method
- Drop indexes before dropping tables
- Drop foreign keys before dropping tables

### 3. Performance Considerations
- Add appropriate indexes for query performance
- Use proper data types to optimize storage
- Consider adding constraints for data integrity

### 4. Naming Consistency
- Follow established naming conventions
- Use descriptive names for indexes and foreign keys
- Maintain consistent casing (snake_case for database, PascalCase for classes)

### 5. Testing Migrations
- Test both `up()` and `down()` methods
- Verify data integrity after migration
- Test rollback scenarios

## Migration Commands

### Generate Migration
```bash
pnpm run migration:generate -- --name=Create{ENTITY_NAME}Table
```

### Run Migrations
```bash
pnpm run migration:run
```

### Revert Migration
```bash
pnpm run migration:revert
```

### Show Migration Status
```bash
pnpm run migration:show
```

## Common Migration Patterns

### Simple Table Creation
```typescript
export class CreateSimpleTable{TIMESTAMP} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'simple_table',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('simple_table');
  }
}
```

### Table with Foreign Key
```typescript
export class CreateRelatedTable{TIMESTAMP} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'related_table',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'parent_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'related_table',
      new TableForeignKey({
        name: 'FK_RELATED_TABLE_PARENT',
        columnNames: ['parent_id'],
        referencedTableName: 'parent_table',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add index
    await queryRunner.createIndex(
      'related_table',
      new TableIndex({
        name: 'IDX_RELATED_TABLE_PARENT_ID',
        columnNames: ['parent_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('related_table', 'IDX_RELATED_TABLE_PARENT_ID');
    await queryRunner.dropForeignKey('related_table', 'FK_RELATED_TABLE_PARENT');
    await queryRunner.dropTable('related_table');
  }
}
```

## Troubleshooting

### Common Issues

1. **Migration Already Exists**
   - Check existing migration files
   - Use unique timestamp for new migrations

2. **Column Type Mismatch**
   - Verify Entity decorator types
   - Ensure database type compatibility

3. **Foreign Key Errors**
   - Check referenced table exists
   - Verify column names and types match

4. **Index Name Conflicts**
   - Use unique index names
   - Follow naming conventions

### Validation Checklist

- [ ] Migration file follows naming convention
- [ ] All Entity columns are represented
- [ ] Column types match Entity decorators
- [ ] Proper indexes are created
- [ ] Foreign keys are properly defined
- [ ] `down()` method is implemented
- [ ] Migration can be rolled back safely
- [ ] No naming conflicts with existing migrations

---

**Remember**: Always create migrations based on your Entity definitions to maintain consistency between your domain model and database schema.
