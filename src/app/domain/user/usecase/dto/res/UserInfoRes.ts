import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { UserPublicInfoResData } from './UserPublicInfoRes';

export class UserInfoResData extends UserPublicInfoResData {
  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;
}

export class UserInfoRes extends HttpRestApiResponse {
  @ApiProperty({ type: UserInfoResData })
  public data: UserInfoResData;
}
