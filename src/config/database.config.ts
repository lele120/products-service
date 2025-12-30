import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: (process.env.DATABASE_DIALECT as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USERNAME || undefined,
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_DATABASE || undefined,
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
