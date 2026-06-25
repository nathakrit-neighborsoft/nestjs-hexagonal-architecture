import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { StrictBuilder } from 'builder-pattern';
import 'dotenv/config';
import { ClsModuleOptions } from 'nestjs-cls';
import { DatabaseModule } from 'src/databases/database.module';
import { DRIZZLE_DB } from 'src/databases/drizzle.database.providers';

const imports = [DatabaseModule];
const adapter = new TransactionalAdapterDrizzleOrm({
  drizzleInstanceToken: DRIZZLE_DB,
});
const clsPluginTransactional = new ClsPluginTransactional({
  imports,
  adapter,
});
const plugins = [clsPluginTransactional];

const drizzleRootConfig = StrictBuilder<ClsModuleOptions>().plugins(plugins).build();

export { drizzleRootConfig };
