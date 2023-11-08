import { ApiProperty } from '@nestjs/swagger';
import { IUserUpdatePassBody } from './UserUpdatePassPayload';
import { HttpRestApiResponse } from '../../../../../../core/documentation/HttpRestApiResponse';

export class UserUpdatePassBody implements IUserUpdatePassBody {
  @ApiProperty({ example: '12345678' })
  public oldPass: string;

  @ApiProperty({ example: '00000000' })
  public newPass: string;
}

export class UserUpdatePassRes extends HttpRestApiResponse {
  @ApiProperty({ example: 'Password updated.' })
  public message: string;
}
