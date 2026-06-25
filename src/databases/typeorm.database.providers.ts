import { typeOrmDatabaseConfig } from 'src/configs/typeorm.config';
import { DataSource } from 'typeorm';

export const dataSourceToken = 'DATA_SOURCE';
export const typeormDatabaseProviders = [
  {
    provide: dataSourceToken,
    useFactory: async () => {
      const dataSource = new DataSource(typeOrmDatabaseConfig);
      return dataSource.initialize();
    },
  },
];
