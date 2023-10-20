export class ApiServerConfig {
  public static readonly PORT: number = parseInt(
    process.env.SERVER_PORT || '8000',
  );

  public static readonly HOST: string = process.env.SERVER_HOST || 'localhost';

  public static readonly LOG_ENABLE: boolean =
    process.env.SERVER_LOG_ENABLE === 'true' ? true : false;

  public static readonly ENV: string = process.env.SERVER_ENV || 'development';
}
