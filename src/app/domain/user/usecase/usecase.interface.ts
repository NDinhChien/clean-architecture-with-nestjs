import { UseCase } from '@core/usecase/UseCase';
import { UserSignUpPayload } from './users/user-signup/UserSignUpPayload';
import { UserSignUpResData } from './users/user-signup/UserSignUpDoc';
import { IssueEmailCodePayload } from './email/issue-email-code/IssueEmailCodePayload';
import { UserVerifyEmailPayload } from './email/user-verify-email/UserVerifyEmailPayload';
import { UserGetPubProfilePayload } from './profile/user-get-public-profile/UserGetPubProfilePayload';
import { AdminGetUserListPayload } from './users/admin-get-user-list/AdminGetUserListPayload';
import { UserInfoResData } from './dto/res/UserInfoRes';
import { AdminGetUserPayload } from './users/admin-get-user/AdminGetUserPayload';
import { UserResetPasswordPayload } from './password/user-reset-password/UserResetPasswordPayload';
import { UserUpdatePassPayload } from './password/user-update-password/UserUpdatePassPayload';
import { UserEditProfilePayload } from './profile/user-edit-profile/UserEditProfilePayload';
import { UserPublicInfoResData } from './dto/res/UserPublicInfoRes';

// users
export interface IUserSignUpUseCase
  extends UseCase<UserSignUpPayload, UserSignUpResData> {}
export interface IAdminGetUserUseCase
  extends UseCase<AdminGetUserPayload, UserInfoResData> {}
export interface IAdminGetUserListUseCase
  extends UseCase<AdminGetUserListPayload, UserInfoResData[]> {}

// profile
export interface IUserEditProfileUseCase
  extends UseCase<UserEditProfilePayload, UserPublicInfoResData> {}
export interface IUserGetPubProfileUseCase
  extends UseCase<UserGetPubProfilePayload, UserPublicInfoResData> {}

// email
export interface IIssueEmailCodeUseCase
  extends UseCase<IssueEmailCodePayload, void> {}
export interface IUserVerifyEmailUseCase
  extends UseCase<UserVerifyEmailPayload, void> {}

// pasword
export interface IUserResetPasswordUseCase
  extends UseCase<UserResetPasswordPayload, void> {}
export interface IUserUpdatePassUseCase
  extends UseCase<UserUpdatePassPayload, void> {}
