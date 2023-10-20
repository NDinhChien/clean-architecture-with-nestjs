export class UserDITokens {
  // Use-cases
  // users
  public static readonly UserSignUpUseCase: unique symbol =
    Symbol('UserSignUpUseCase');
  public static readonly AdminGetUserListUseCase: unique symbol = Symbol(
    'AdminGetUserListUseCase',
  );
  public static readonly AdminGetUserUseCase: unique symbol = Symbol(
    'AdminGetUserUseCase',
  );

  // profile
  public static readonly UserGetPubProfileUseCase: unique symbol = Symbol(
    'UserGetPubProfileUseCase',
  );
  public static readonly UserEditProfileUseCase: unique symbol = Symbol(
    'UserEditProfileUseCase',
  );

  // email
  public static readonly IssueEmailCodeUseCase: unique symbol = Symbol(
    'IssueEmailCodeUseCase',
  );
  public static readonly UserVerifyEmailUseCase: unique symbol = Symbol(
    'UserVerifyEmailUseCase',
  );

  // password
  public static readonly UserResetPasswordUseCase: unique symbol = Symbol(
    'UserResetPasswordUseCase',
  );
  public static readonly UserUpdatePassUseCase: unique symbol = Symbol(
    'UserUpdatePassUseCase',
  );

  // Repositories

  public static readonly UserRepository: unique symbol =
    Symbol('UserRepository');
  public static readonly KeyRepository: unique symbol = Symbol('KeyRepository');
  public static readonly LoginRepository: unique symbol =
    Symbol('LoginRepository');
  public static readonly EmailRepository: unique symbol =
    Symbol('EmailRepository');
}
