import 'dotenv/config';
import { DataSource } from 'typeorm';
import { typeOrmDatabaseConfig } from '../configs/typeorm.config';

const appDataSource = new DataSource(typeOrmDatabaseConfig);

export default appDataSource;
