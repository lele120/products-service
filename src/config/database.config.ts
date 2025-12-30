import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: configService.get<string>('DATABASE_DIALECT', 'mysql') as any,
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  synchronize: configService.get<string>('SEQUELIZE_SYNC') === 'true',
  autoLoadModels: true,
  logging:
    configService.get<string>('SEQUELIZE_LOGGING') === 'true'
      ? console.log
      : false,
  pool: {
    max: parseInt(configService.get<string>('DATABASE_POOL_MAX', '10'), 10),
    min: parseInt(configService.get<string>('DATABASE_POOL_MIN', '0'), 10),
    acquire: parseInt(
      configService.get<string>('DATABASE_POOL_ACQUIRE', '30000'),
      10,
    ),
    idle: parseInt(
      configService.get<string>('DATABASE_POOL_IDLE', '10000'),
      10,
    ),
  },
  ssl: configService.get<string>('DATABASE_SSL') === 'true',
});
