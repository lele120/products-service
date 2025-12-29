import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: (process.env.DATABASE_DIALECT as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || 'DB_PORT not found', 10),
  username: process.env.DB_USERNAME || 'DB_USERNAME not found',
  password: process.env.DB_PASSWORD || 'DB_PASSWORD not found',
  database: process.env.DB_DATABASE || 'DB_DATABASE not found',
  synchronize: process.env.SEQUELIZE_SYNC === 'true',
  autoLoadModels: true,
  logging: process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
    min: parseInt(process.env.DATABASE_POOL_MIN || '0', 10),
    acquire: parseInt(process.env.DATABASE_POOL_ACQUIRE || '30000', 10),
    idle: parseInt(process.env.DATABASE_POOL_IDLE || '10000', 10),
  },
  ssl: process.env.DATABASE_SSL === 'true',
};
