import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginBody {
  @ApiProperty({ example: 'test123@gmail.com' })
  public email: string;

  @ApiProperty({ example: '12345678' })
  public password: string;
}

export class UserLoginResData {
  @ApiProperty({
    example: '360fac3a-d3d8-44fa-ae8e-1430c9617eb3',
  })
  public id: string;

  @ApiProperty({ example: 'an access token' })
  public accessToken: string;

  @ApiProperty({ example: 'a refresh token' })
  public refreshToken: string;
}

export class UserLoginRes extends HttpRestApiResponse {
  @ApiProperty({ example: 'Login successfully.' })
  public message: string;

  @ApiProperty({ type: UserLoginResData })
  public data: UserLoginResData;
}
