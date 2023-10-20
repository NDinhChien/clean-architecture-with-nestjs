import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginBody {
  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;

  @ApiProperty({ type: 'string', example: '12345678' })
  public password: string;
}

export class UserLoginResData {
  @ApiProperty({
    type: 'string',
    example: '360fac3a-d3d8-44fa-ae8e-1430c9617eb3',
  })
  public id: string;

  @ApiProperty({ type: 'string', example: 'eyJhbGciOieyJpc3MiOitQ_qiv2K9l...' })
  public accessToken: string;

  @ApiProperty({ type: 'string', example: 'eyJhbGciOieyJpc3MiOiRzS0kAcCki...' })
  public refreshToken: string;
}

export class UserLoginRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Login successfully.' })
  public message: string;

  @ApiProperty({ type: UserLoginResData })
  public data: UserLoginResData;
}

/*--------------Doc Response--------------*/
/*---------------Interface----------------*/
/*------------UseCase Payload-------------*/
/*--------------Doc Request---------------*/
