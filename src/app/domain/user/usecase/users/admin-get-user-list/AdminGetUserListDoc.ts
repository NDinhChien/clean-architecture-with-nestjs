import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@core/documentation/HttpRestApiResponse';
import { UserInfoResData } from '../../dto/res/UserInfoRes';

export const limitQuery = {
  name: 'limit',
  type: 'number',
  example: '5',
  required: true,
  description: 'number of users to get',
};

export const offsetQuery = {
  name: 'offset',
  type: 'number',
  example: '0',
  required: true,
  description: 'page number',
};

export const includeRemovedQuery = {
  name: 'includeRemoved',
  type: 'boolean',
  example: 'true',
  required: true,
};

export class AdminGetUserListRes extends HttpRestApiResponse {
  @ApiProperty({ type: 'string', example: 'User list.' })
  public message: string;

  @ApiProperty({ type: UserInfoResData, isArray: true })
  public data: UserInfoResData[];
}
