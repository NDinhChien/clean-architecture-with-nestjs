import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@core/enums/UserEnums';

export class UserSignUpBody {
  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;

  @ApiProperty({ type: 'string', example: '12345678' })
  public password: string;
}

export class UserSignUpResData {
  @ApiProperty({
    type: 'string',
    example: '360fac3a-d3d8-44fa-ae8e-1430c9617eb3',
  })
  public id: string;

  @ApiProperty({ type: 'string', example: 'dinhchien25112001@gmail.com' })
  public email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.GUEST })
  public role: UserRole;
}

export class UserSignUpRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Signup successfully.' })
  public message: string;

  @ApiProperty({ type: UserSignUpResData })
  public data: UserSignUpResData;
}
