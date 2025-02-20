import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';

dotenv.config();

const mikroOrmConfig: MikroOrmModuleOptions = {
  entities: ['./dist/src/shared/domain/entities'],
  entitiesTs: ['./src/shared/domain/entities'],
  dbName: process.env.DATABASE_NAME,
  driver: PostgreSqlDriver,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
  seeder: {
    path: './dist/src/shared/infrastructure/seeder',
    pathTs: './src/shared/infrastructure/seeder',
  },
  extensions: [Migrator, SeedManager],
};

export default mikroOrmConfig;
