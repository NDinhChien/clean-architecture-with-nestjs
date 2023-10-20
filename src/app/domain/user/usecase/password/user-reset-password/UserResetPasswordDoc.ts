import { ApiProperty } from '@nestjs/swagger';
import { IUserResetPasswordBody } from './UserResetPasswordPayload';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';

export class UserResetPasswordBody implements IUserResetPasswordBody {
  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;
}

export class UserResetPasswordRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Reset password successfully.' })
  public message: string;
}
