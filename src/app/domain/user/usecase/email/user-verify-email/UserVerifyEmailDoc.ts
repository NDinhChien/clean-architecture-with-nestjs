import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { IUserVerifyEmailBody } from './UserVerifyEmailPayload';

export class UserVerifyEmailBody implements IUserVerifyEmailBody {
  @ApiProperty({ example: 'test@email.com' })
  public email: string;

  @ApiProperty({ example: '232953' })
  public code: string;
}

export class UserVerifyEmailRes extends HttpRestApiResponse {
  @ApiProperty({ example: 'Verified successfully.' })
  public message: string;
}
