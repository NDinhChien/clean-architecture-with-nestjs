import { CoreApiResponse } from '@core/CoreApiResponse';
import {
  IUserLoginBody,
  UserLoginPayload,
} from './usecase/user-login/UserLoginPayload';
import { UserLogoutPayload } from './usecase/user-logout/UserLogoutPayload';
import {
  IUserRefreshTokenBody,
  UserRefreshTokenPayload,
} from './usecase/user-refresh-token/UserRefreshTokenPayload';
import {
  UserLoginBody,
  UserLoginRes,
  UserLoginResData,
} from './usecase/user-login/UserLoginDoc';
import {
  UserRefreshTokenBody,
  UserRefreshTokenRes,
  UserRefreshTokenResData,
} from './usecase/user-refresh-token/UserRefreshTokenDoc';
import {
  IUserLoginUseCase,
  IUserLogoutUseCase,
  IUserRefreshTokenUseCase,
} from './usecase/usecase.interface';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDITokens } from './AuthDITokens';
import { Inject } from '@nestjs/common';
import { HttpUser } from './decorator/HttpUser';
import { User } from '../domain/user/entity/User';
import { Request } from 'express';
import { HttpJwtPayload } from './types/HttpJwtPayload';
import { HttpAuth } from './decorator/HttpAuth';
import { UserLogoutRes } from './usecase/user-logout/UserLogoutDoc';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthDITokens.UserLoginUseCase)
    private readonly userLoginUseCase: IUserLoginUseCase,

    @Inject(AuthDITokens.UserLogoutUseCase)
    private readonly userLogoutUseCase: IUserLogoutUseCase,

    @Inject(AuthDITokens.UserRefreshTokenUseCase)
    private readonly userRefreshTokenUseCase: IUserRefreshTokenUseCase,
  ) {}

  @Post('login')
  @ApiBody({ type: UserLoginBody })
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginRes })
  public async login(
    @Body() body: IUserLoginBody,
  ): Promise<CoreApiResponse<UserLoginResData>> {
    const adapter: UserLoginPayload = await UserLoginPayload.new({
      email: body.email,
      password: body.password,
    });
    return CoreApiResponse.success(
      await this.userLoginUseCase.execute(adapter),
      'Login successfully.',
    );
  }

  @Delete('logout')
  @HttpAuth()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserLogoutRes })
  public async logout(@HttpUser() user: User) {
    const adapter: UserLogoutPayload = await UserLogoutPayload.new({
      id: user.getId(),
      email: user.getEmail(),
    });

    return CoreApiResponse.success(
      await this.userLogoutUseCase.execute(adapter),
      'Logout successfully.',
    );
  }

  @Put('token/refresh')
  
  @ApiBearerAuth()
  @ApiBody({ type: UserRefreshTokenBody })
  @ApiResponse({ type: UserRefreshTokenRes })
  public async refreshToken(
    @Req() request: Request,
    @Body() body: IUserRefreshTokenBody,
  ): Promise<CoreApiResponse<UserRefreshTokenResData>> {
    const accessToken = HttpJwtPayload.extractTokenFromRequest(request);
    const adapter: UserRefreshTokenPayload = await UserRefreshTokenPayload.new({
      accessToken: accessToken,
      refreshToken: body.refreshToken,
    });
    return CoreApiResponse.success(
      await this.userRefreshTokenUseCase.execute(adapter),
      'Token refreshed.',
    );
  }
}
