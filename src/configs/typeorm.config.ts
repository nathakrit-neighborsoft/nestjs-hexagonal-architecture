import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { StrictBuilder } from 'builder-pattern';
import 'dotenv/config';
import { ClsModuleOptions } from 'nestjs-cls';
import { DatabaseModule } from 'src/databases/database.module';
import { dataSourceToken } from 'src/databases/typeorm.database.providers';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const dialect = process.env.DB_DIALECT ?? 'postgres';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
const typeOrmDatabaseConfig = StrictBuilder<PostgresConnectionOptions>()
  .type(dialect as 'postgres')
  .host(process.env.DB_HOST || 'localhost')
  .port(dbPort)
  .username(process.env.DB_USERNAME || 'postgres')
  .password(process.env.DB_PASSWORD || '')
  .database(process.env.DB_DATABASE || 'nestjs-hexagonal-architecture-typeorm')
  .entities([__dirname + '/../**/*.entity{.ts,.js}'])
  .synchronize(false)
  .logging(true)
  .migrations([__dirname + '/../databases/migrations/*{.ts,.js}'])
  .migrationsTableName('migrations_history')
  .migrationsRun(false)
  .build();

const imports = [DatabaseModule];
const adapter = new TransactionalAdapterTypeOrm({
  dataSourceToken: dataSourceToken,
});
const clsPluginTransactional = new ClsPluginTransactional({
  imports,
  adapter,
});
const plugins = [clsPluginTransactional];

const typeormRootConfig = StrictBuilder<ClsModuleOptions>().plugins(plugins).build();

export { typeOrmDatabaseConfig, typeormRootConfig };
