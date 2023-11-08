import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@core/enums/UserEnums';

export class UserSignUpBody {
  @ApiProperty({ example: 'test@email.com' })
  public email: string;

  @ApiProperty({ example: '12345678' })
  public password: string;
}

export class UserSignUpResData {
  @ApiProperty({
    example: '360fac3a-d3d8-44fa-ae8e-1430c9617eb3',
  })
  public id: string;

  @ApiProperty({ example: 'test@email.com' })
  public email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.GUEST })
  public role: UserRole;
}

export class UserSignUpRes extends HttpRestApiResponse {
  @ApiProperty({ example: 'Signup successfully.' })
  public message: string;

  @ApiProperty({ type: UserSignUpResData })
  public data: UserSignUpResData;
}
