import { CoreApiResponse } from '@core/CoreApiResponse';
import { UserDITokens } from './UserDITokens';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  IAdminGetUserListUseCase,
  IAdminGetUserUseCase,
  IIssueEmailCodeUseCase,
  IUserEditProfileUseCase,
  IUserGetPubProfileUseCase,
  IUserResetPasswordUseCase,
  IUserSignUpUseCase,
  IUserUpdatePassUseCase,
  IUserVerifyEmailUseCase,
} from './usecase/usecase.interface';
import {
  IUserSignUpBody,
  UserSignUpPayload,
} from './usecase/users/user-signup/UserSignUpPayload';
import { UserInfoRes, UserInfoResData } from './usecase/dto/res/UserInfoRes';
import { HttpAuth } from '../../auth/decorator/HttpAuth';
import { HttpUser } from '../../auth/decorator/HttpUser';
import { UserInfoDto } from './usecase/dto/UserInfoDto';
import { User } from './entity/User';
import {
  UserSignUpBody,
  UserSignUpRes,
  UserSignUpResData,
} from './usecase/users/user-signup/UserSignUpDoc';
import {
  IssueEmailCodeBody,
  IssueEmailCodeRes,
} from './usecase/email/issue-email-code/IssueEmailCodeDoc';
import {
  IIssueEmailCodeBody,
  IssueEmailCodePayload,
} from './usecase/email/issue-email-code/IssueEmailCodePayload';
import {
  IUserVerifyEmailBody,
  UserVerifyEmailPayload,
} from './usecase/email/user-verify-email/UserVerifyEmailPayload';
import {
  UserVerifyEmailBody,
  UserVerifyEmailRes,
} from './usecase/email/user-verify-email/UserVerifyEmailDoc';
import {
  UserEditProfileBody,
  UserEditProfileRes,
} from './usecase/profile/user-edit-profile/UserEditProfileDoc';
import {
  IUserEditProfileBody,
  UserEditProfilePayload,
} from './usecase/profile/user-edit-profile/UserEditProfilePayload';
import { UserIdParam } from './usecase/profile/user-get-public-profile/UserGetPubProfileDoc';
import {
  IUserIdParam,
  UserGetPubProfilePayload,
} from './usecase/profile/user-get-public-profile/UserGetPubProfilePayload';
import {
  AdminGetUserListPayload,
  IAdminGetUserListPayload,
} from './usecase/users/admin-get-user-list/AdminGetUserListPayload';
import {
  AdminGetUserListRes,
  includeRemovedQuery,
  limitQuery,
  offsetQuery,
} from './usecase/users/admin-get-user-list/AdminGetUserListDoc';
import {
  AdminGetUserPayload,
  IAdminGetUserPayload,
} from './usecase/users/admin-get-user/AdminGetUserPayload';
import { UserRole } from '../../../core/enums/UserEnums';
import {
  IUserResetPasswordBody,
  UserResetPasswordPayload,
} from './usecase/password/user-reset-password/UserResetPasswordPayload';
import {
  UserResetPasswordBody,
  UserResetPasswordRes,
} from './usecase/password/user-reset-password/UserResetPasswordDoc';
import {
  IUserUpdatePassBody,
  UserUpdatePassPayload,
} from './usecase/password/user-update-password/UserUpdatePassPayload';
import {
  UserUpdatePassBody,
  UserUpdatePassRes,
} from './usecase/password/user-update-password/UserUpdatePassDoc';
import {
  UserPublicInfoRes,
  UserPublicInfoResData,
} from './usecase/dto/res/UserPublicInfoRes';

@ApiTags('users')
@Controller('users')
export class UserUsersController {
  constructor(
    @Inject(UserDITokens.UserSignUpUseCase)
    private readonly userSignUpUseCase: IUserSignUpUseCase,

    @Inject(UserDITokens.AdminGetUserListUseCase)
    private readonly adminGetUserListUseCase: IAdminGetUserListUseCase,

    @Inject(UserDITokens.AdminGetUserUseCase)
    private readonly adminGetUserUseCase: IAdminGetUserUseCase,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserSignUpBody })
  @ApiResponse({ status: HttpStatus.OK, type: UserSignUpRes })
  public async createUser(
    @Body() body: IUserSignUpBody,
  ): Promise<CoreApiResponse<UserSignUpResData>> {
    const adapter: UserSignUpPayload = await UserSignUpPayload.new({
      email: body.email,
      password: body.password,
    });

    return CoreApiResponse.success(
      await this.userSignUpUseCase.execute(adapter),
      'Signup successfully.',
    );
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @HttpAuth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiQuery(offsetQuery)
  @ApiQuery(limitQuery)
  @ApiQuery(includeRemovedQuery)
  @ApiResponse({ status: HttpStatus.OK, type: AdminGetUserListRes })
  public async getUsers(
    @Query() query: IAdminGetUserListPayload,
  ): Promise<CoreApiResponse<UserInfoResData[]>> {
    const adapter: AdminGetUserListPayload = await AdminGetUserListPayload.new({
      offset: query.offset,
      limit: query.limit,
      includeRemoved: query.includeRemoved,
    });

    return CoreApiResponse.success(
      await this.adminGetUserListUseCase.execute(adapter),
      'User list.',
    );
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @HttpAuth(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiParam(UserIdParam)
  @ApiResponse({ status: HttpStatus.OK, type: UserInfoRes })
  public async getUser(
    @Param() param: IAdminGetUserPayload,
  ): Promise<CoreApiResponse<UserInfoResData>> {
    const adapter: AdminGetUserPayload = await AdminGetUserPayload.new({
      id: param.id,
    });
    return CoreApiResponse.success(
      await this.adminGetUserUseCase.execute(adapter),
      'User profile',
    );
  }
}

@ApiTags('profile')
@Controller('profile')
export class UserProfileController {
  constructor(
    @Inject(UserDITokens.UserEditProfileUseCase)
    private readonly userEditProfileUseCase: IUserEditProfileUseCase,

    @Inject(UserDITokens.UserGetPubProfileUseCase)
    private readonly userGetPubProfileUseCase: IUserGetPubProfileUseCase,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @HttpAuth()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserInfoRes })
  public async getMyProfile(
    @HttpUser() user: User,
  ): Promise<CoreApiResponse<UserInfoResData>> {
    return CoreApiResponse.success(UserInfoDto.newFromUser(user), 'My profile');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @HttpAuth()
  @ApiBearerAuth()
  @ApiBody({ type: UserEditProfileBody })
  @ApiResponse({ type: UserEditProfileRes })
  public async editMyProfile(
    @HttpUser() user: User,
    @Body() body: IUserEditProfileBody,
  ): Promise<CoreApiResponse<UserPublicInfoResData>> {
    const adapter = await UserEditProfilePayload.new({
      firstName: body.firstName,
      lastName: body.lastName,
      birthday: body.birthday,
      intro: body.intro,
      user: user,
    });

    return CoreApiResponse.success(
      await this.userEditProfileUseCase.execute(adapter),
      'Profile updated.',
    );
  }

  @Get('public/id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserPublicInfoRes })
  @ApiParam(UserIdParam)
  public async getPublicProfile(
    @Param() param: IUserIdParam,
  ): Promise<CoreApiResponse<UserPublicInfoResData>> {
    const adapter = await UserGetPubProfilePayload.new({
      id: param.id,
    });
    return CoreApiResponse.success(
      await this.userGetPubProfileUseCase.execute(adapter),
      'Public profile.',
    );
  }
}

@ApiTags('email')
@Controller('email')
export class UserEmailController {
  constructor(
    @Inject(UserDITokens.IssueEmailCodeUseCase)
    private readonly issueEmailCodeUseCase: IIssueEmailCodeUseCase,

    @Inject(UserDITokens.UserVerifyEmailUseCase)
    private readonly userVerifyEmailUseCase: IUserVerifyEmailUseCase,
  ) {}

  @Put('issue')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: IssueEmailCodeBody })
  @ApiResponse({ type: IssueEmailCodeRes })
  public async issueEmailCode(
    @Body() body: IIssueEmailCodeBody,
  ): Promise<CoreApiResponse<void>> {
    const adapter = await IssueEmailCodePayload.new({
      email: body.email,
    });
    return CoreApiResponse.success(
      await this.issueEmailCodeUseCase.execute(adapter),
      'Email code issued.',
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserVerifyEmailBody })
  @ApiResponse({ type: UserVerifyEmailRes })
  public async verifyEmail(
    @Body() body: IUserVerifyEmailBody,
  ): Promise<CoreApiResponse<void>> {
    const adapter = await UserVerifyEmailPayload.new({
      email: body.email,
      code: body.code,
    });
    return CoreApiResponse.success(
      await this.userVerifyEmailUseCase.execute(adapter),
      'Verify successfully',
    );
  }
}

@ApiTags('password')
@Controller('password')
export class UserPasswordController {
  constructor(
    @Inject(UserDITokens.UserUpdatePassUseCase)
    private readonly userUpdatePassUseCase: IUserUpdatePassUseCase,

    @Inject(UserDITokens.UserResetPasswordUseCase)
    private readonly userResetPasswordUseCase: IUserResetPasswordUseCase,
  ) {}

  @Put('reset')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserResetPasswordBody })
  @ApiResponse({ type: UserResetPasswordRes })
  public async resetPassword(
    @Body() body: IUserResetPasswordBody,
  ): Promise<CoreApiResponse<void>> {
    const adapter: UserResetPasswordPayload =
      await UserResetPasswordPayload.new({
        email: body.email,
      });
    return CoreApiResponse.success(
      await this.userResetPasswordUseCase.execute(adapter),
      'Reset password successfully.',
    );
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @HttpAuth()
  @ApiBearerAuth()
  @ApiBody({ type: UserUpdatePassBody })
  @ApiResponse({ type: UserUpdatePassRes })
  public async updatePassword(
    @HttpUser() user: User,
    @Body() body: IUserUpdatePassBody,
  ): Promise<CoreApiResponse<void>> {
    const adapter = await UserUpdatePassPayload.new({
      oldPass: body.oldPass,
      newPass: body.newPass,
      user: user,
    });
    return CoreApiResponse.success(
      await this.userUpdatePassUseCase.execute(adapter),
      'Password updated.',
    );
  }
}
