import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { IUserVerifyEmailBody } from './UserVerifyEmailPayload';

export class UserVerifyEmailBody implements IUserVerifyEmailBody {
  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;

  @ApiProperty({ type: 'string', example: '012345' })
  public code: string;
}

export class UserVerifyEmailRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Verified successfully.' })
  public message: string;
}
