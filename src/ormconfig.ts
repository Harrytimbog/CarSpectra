// This file is used by TypeORM to connect to the database
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env variables

let dbConfig: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    dbConfig = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
    };
    break;

  case 'test':
    dbConfig = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
    };
    break;

  case 'production':
    throw new Error('Production config not set yet');
  default:
    throw new Error('No / Unknown NODE_ENV specified');
}

export const AppDataSource = new DataSource(dbConfig);
