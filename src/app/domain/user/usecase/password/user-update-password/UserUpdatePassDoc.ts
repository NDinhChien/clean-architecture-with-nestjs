import { ApiProperty } from '@nestjs/swagger';
import { IUserUpdatePassBody } from './UserUpdatePassPayload';
import { HttpRestApiResponse } from '../../../../../../core/documentation/HttpRestApiResponse';

export class UserUpdatePassBody implements IUserUpdatePassBody {
  @ApiProperty({ type: 'string' })
  public oldPass: string;

  @ApiProperty({ type: 'string' })
  public newPass: string;
}

export class UserUpdatePassRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Password updated.' })
  public message: string;
}
