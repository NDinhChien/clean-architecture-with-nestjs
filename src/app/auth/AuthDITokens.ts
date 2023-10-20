export class AuthDITokens {
  // Use-cases

  public static readonly UserLoginUseCase: unique symbol =
    Symbol('UserLoginUseCase');
  public static readonly UserLogoutUseCase: unique symbol =
    Symbol('UserLogoutUseCase');
  public static readonly UserRefreshTokenUseCase: unique symbol = Symbol(
    'UserRefreshTokenUseCase',
  );
}
