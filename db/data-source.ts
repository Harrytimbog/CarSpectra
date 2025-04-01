import 'reflect-metadata';

import { DataSource, DataSourceOptions } from 'typeorm';

let dbOptions: DataSourceOptions = {
  type: 'sqlite',
  database: '',
  entities: [],
  migrations: [],
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbOptions, {
      database: process.env.DB_NAME || 'db.sqlite',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
    });
    break;

  case 'test':
    Object.assign(dbOptions, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/db/migrations/*.ts'],
      synchronize: true, // <-- allow automatic schema sync in test
      migrationsRun: false, // <-- unnecessary when synchronize is true
      dropSchema: true,     // <-- optional but good to start fresh
    });
    break;

  case 'production':
    // Object.assign(dbOptions, {
    //   database: process.env.DB_NAME || 'db.sqlite',
    //   entities: ['dist/**/*.entity.js'],
    //   migrations: ['dist/db/migrations/*.js'],
    // });
    break;

  default:
    throw new Error('Unknown environment');
}

export const dataSourceOptions: DataSourceOptions = dbOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
