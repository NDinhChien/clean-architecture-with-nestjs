import { UseCase } from '@core/usecase/UseCase';
import { UserLoginPayload } from './user-login/UserLoginPayload';
import { UserLoginResData } from './user-login/UserLoginDoc';
import { UserLogoutPayload } from './user-logout/UserLogoutPayload';
import { UserRefreshTokenPayload } from './user-refresh-token/UserRefreshTokenPayload';
import { UserRefreshTokenResData } from './user-refresh-token/UserRefreshTokenDoc';

export interface IUserLoginUseCase
  extends UseCase<UserLoginPayload, UserLoginResData> {}
export interface IUserLogoutUseCase extends UseCase<UserLogoutPayload, void> {}
export interface IUserRefreshTokenUseCase
  extends UseCase<UserRefreshTokenPayload, UserRefreshTokenResData> {}
