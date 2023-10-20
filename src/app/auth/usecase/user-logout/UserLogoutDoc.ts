import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '../../../../core/documentation/HttpRestApiResponse';

export class UserLogoutRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'Logout successfully.' })
  public message: string;
}
