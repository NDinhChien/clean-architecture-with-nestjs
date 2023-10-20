export class DatabaseConfig {
  public static readonly DB_HOST: string = process.env.DB_HOST || 'localhost';

  public static readonly DB_PORT: number = parseInt(
    process.env.DB_PORT || '3000',
  );

  public static readonly DB_USERNAME: string = process.env
    .DB_USERNAME as string;

  public static readonly DB_PASSWORD: string = process.env
    .DB_PASSWORD as string;

  public static readonly DB_NAME: string = process.env.DB_NAME as string;

  public static readonly DB_LOG_ENABLE: boolean =
    process.env.DB_LOG_ENABLE === 'true' ? true : false;

  public static readonly IS_SYNCHRONIZE: boolean =
    process.env.DB_IS_SYNCHRONIZE === 'true' ? true : false;
}
