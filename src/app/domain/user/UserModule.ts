import {
  UserUsersController,
  UserProfileController,
  UserEmailController,
  UserPasswordController,
} from './UserController';
import { UserDITokens } from './UserDITokens';
import { UserSignUpUseCase } from './usecase/users/user-signup/UserSignUpUseCase';
import { TypeOrmEmailRepository } from '../../infra/persistence/repository/TypeOrmEmailRepository';
import { TypeOrmKeyRepository } from '../../infra/persistence/repository/TypeOrmKeyRepository';
import { TypeOrmLoginRepository } from '../../infra/persistence/repository/TypeOrmLoginRepository';
import { TypeOrmUserRepository } from '../../infra/persistence/repository/TypeOrmUserRepository';
import { Module, Provider } from '@nestjs/common';
import { IssueEmailCodeUseCase } from './usecase/email/issue-email-code/IssueEmailCodeUseCase';
import { UserVerifyEmailUseCase } from './usecase/email/user-verify-email/UserVerifyEmailUseCase';
import { UserGetPubProfileUseCase } from './usecase/profile/user-get-public-profile/UserGetPubProfileUseCase';
import { AdminGetUserListUseCase } from './usecase/users/admin-get-user-list/AdminGetUserListUseCase';
import { AdminGetUserUseCase } from './usecase/users/admin-get-user/AdminGetUserUseCase';
import { UserResetPasswordUseCase } from './usecase/password/user-reset-password/UserResetPasswordUseCase';
import { UserEditProfileUseCase } from './usecase/profile/user-edit-profile/UserEditProfileUseCase';
import { UserUpdatePassUseCase } from './usecase/password/user-update-password/UserUpdatePassUseCase';

const persistenceProviders: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useClass: TypeOrmUserRepository,
  },
  // the following tables are used to assist User usecases
  {
    // login table to assist user login usecase
    provide: UserDITokens.LoginRepository,
    useClass: TypeOrmLoginRepository,
  },
  {
    // email table to assist issue and verify email
    provide: UserDITokens.EmailRepository,
    useClass: TypeOrmEmailRepository,
  },
  {
    // key table to persist accessKey and refreshKey for users
    provide: UserDITokens.KeyRepository,
    useClass: TypeOrmKeyRepository,
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: UserDITokens.UserSignUpUseCase,
    useClass: UserSignUpUseCase,
  },
  {
    provide: UserDITokens.IssueEmailCodeUseCase,
    useClass: IssueEmailCodeUseCase,
  },
  {
    provide: UserDITokens.UserVerifyEmailUseCase,
    useClass: UserVerifyEmailUseCase,
  },
  {
    provide: UserDITokens.UserGetPubProfileUseCase,
    useClass: UserGetPubProfileUseCase,
  },
  {
    provide: UserDITokens.UserEditProfileUseCase,
    useClass: UserEditProfileUseCase,
  },
  {
    provide: UserDITokens.AdminGetUserListUseCase,
    useClass: AdminGetUserListUseCase,
  },
  {
    provide: UserDITokens.AdminGetUserUseCase,
    useClass: AdminGetUserUseCase,
  },
  {
    provide: UserDITokens.UserResetPasswordUseCase,
    useClass: UserResetPasswordUseCase,
  },
  {
    provide: UserDITokens.UserUpdatePassUseCase,
    useClass: UserUpdatePassUseCase,
  },
];

@Module({
  controllers: [
    UserUsersController,
    UserProfileController,
    UserEmailController,
    UserPasswordController,
  ],
  providers: [...persistenceProviders, ...useCaseProviders],
  exports: [
    UserDITokens.UserRepository,
    UserDITokens.KeyRepository,
    UserDITokens.LoginRepository,
    UserDITokens.EmailRepository,
  ],
})
export class UserModule {}
