import { DatabaseConfig } from '@app/../config/DatabaseConfig';
import { DataSource } from 'typeorm';
import { TypeOrmDirectory } from '@app/infra/persistence/TypeOrmDirectory';
import { TypeOrmLogger } from '@app/infra/persistence/logger/TypeOrmLogger';

export default new DataSource({
  name: 'default',
  type: 'mysql',
  host: DatabaseConfig.DB_HOST,
  port: DatabaseConfig.DB_PORT,
  username: DatabaseConfig.DB_USERNAME,
  password: DatabaseConfig.DB_PASSWORD,
  database: DatabaseConfig.DB_NAME,
  synchronize: DatabaseConfig.IS_SYNCHRONIZE,

  logging: DatabaseConfig.DB_LOG_ENABLE ? 'all' : false,
  logger: DatabaseConfig.DB_LOG_ENABLE ? TypeOrmLogger.new() : undefined,
  entities: [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
  migrations: [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
  migrationsTransactionMode: 'all',
});
