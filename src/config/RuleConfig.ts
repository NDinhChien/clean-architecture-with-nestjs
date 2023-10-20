export class Rule {
  public static readonly AUTH = {
    USERNAME_FIELD: process.env.LOGIN_USERNAME_FIELD || 'username',
    PASSWORD_FIELD: process.env.LOGIN_PASSWORD_FIELD || 'password',
  };

  public static readonly TOKEN = {
    HEADER: process.env.TOKEN_HEADER || 'authorization',
    ISSUER: process.env.TOKEN_ISSUER || 'dev.xyz.com',
    ACCESS_TOKEN_VALIDITY:
      parseInt(process.env.ACCESS_TOKEN_VALIDITY_IN_HOURS || '2') * 3600000,
    REFRESH_TOKEN_VALIDITY:
      parseInt(process.env.REFRESH_TOKEN_VALIDITY_IN_HOURS || '4') * 3600000,
  };

  public static readonly LOGIN = {
    MAX_TRY_TIMES: parseInt(process.env.LOGIN_MAX_TRY_TIMES || '5'),
    RENEW_DURATION:
      parseInt(process.env.LOGIN_RENEW_DURATION_IN_HOURS || '36') * 3600000,
  };

  public static readonly EMAIL = {
    MAX_TRY_TIMES: parseInt(
      process.env.EMAIL_VERIFICATION_MAX_TRY_TIMES || '3',
    ),
    MAX_REFRESH_TIMES: parseInt(
      process.env.EMAIL_VERIFICATION_MAX_REFRESH_TIMES || '1',
    ),
    ENTER_IN:
      parseInt(process.env.EMAIL_VERIFICATION_ENTER_IN_MINUTES || '2') * 60000,
    VALID_IN:
      parseInt(process.env.EMAIL_VERIFICATION_VALID_IN_MINUTES || '2') * 60000,
    RENEW_DURATION:
      parseInt(process.env.EMAIL_VERIFICATION_RENEW_DURATION_IN_HOURS || '36') *
      3600000,
  };
}
