import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@core/enums/UserEnums';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';

export class UserPublicInfoResData {
  @ApiProperty({
    example: '360fac3a-d3d8-44fa-ae8e-1430c9617eb3',
  })
  public id: string;

  @ApiProperty({ enum: UserRole, example: UserRole.GUEST })
  public role: UserRole;

  @ApiPropertyOptional({ example: 'Dinh' })
  public firstName?: string;

  @ApiPropertyOptional({ example: 'Chien' })
  public lastName?: string;

  @ApiPropertyOptional({ type: Date, example: '2001-11-25' })
  public birthday?: Date;

  @ApiPropertyOptional({ example: 'hello the world' })
  public intro?: string;
}

export class UserPublicInfoRes extends HttpRestApiResponse {
  @ApiProperty({ type: UserPublicInfoResData })
  public data: UserPublicInfoResData;
}
