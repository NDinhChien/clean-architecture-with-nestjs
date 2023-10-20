import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@core/enums/UserEnums';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';

/*--------------Doc Response--------------*/
export class UserPublicInfoResData {
  @ApiProperty({
    type: 'string',
    example: '360fac3a-d3d8-44fa-ae8e-1430c9617eb3',
  })
  public id: string;

  @ApiProperty({ enum: UserRole, example: UserRole.GUEST })
  public role: UserRole;

  @ApiPropertyOptional({ type: 'string' })
  public firstName?: string;

  @ApiPropertyOptional({ type: 'string' })
  public lastName?: string;

  @ApiPropertyOptional({ type: Date, example: '2001-11-25T00:00:00.000Z' })
  public birthday?: Date;

  @ApiPropertyOptional({ type: 'string' })
  public intro?: string;
}

export class UserPublicInfoRes extends HttpRestApiResponse {
  @ApiProperty({ type: UserPublicInfoResData })
  public data: UserPublicInfoResData;
}
