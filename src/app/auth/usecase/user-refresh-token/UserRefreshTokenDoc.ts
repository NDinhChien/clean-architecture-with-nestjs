import { UserLoginRes, UserLoginResData } from '../user-login/UserLoginDoc';
import { ApiProperty } from '@nestjs/swagger';
import { IUserRefreshTokenBody } from './UserRefreshTokenPayload';

export class UserRefreshTokenBody implements IUserRefreshTokenBody {
  @ApiProperty({ type: 'string' })
  public refreshToken: string;
}

export class UserRefreshTokenResData extends UserLoginResData {}

export class UserRefreshTokenRes extends UserLoginRes {
  @ApiProperty({ type: 'string', example: 'Token refreshed.' })
  public message: string;
}
