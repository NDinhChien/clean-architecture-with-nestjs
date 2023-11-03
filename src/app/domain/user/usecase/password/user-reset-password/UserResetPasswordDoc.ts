import { ApiProperty } from '@nestjs/swagger';
import { IUserResetPasswordBody } from './UserResetPasswordPayload';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';

export class UserResetPasswordBody implements IUserResetPasswordBody {
  @ApiProperty({ example: 'test@gmail.com' })
  public email: string;
}

export class UserResetPasswordRes extends HttpRestApiResponse {
  @ApiProperty({ example: 'Reset password successfully.' })
  public message: string;
}
